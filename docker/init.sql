-- Extension aktivieren
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Indizes für Performance (HNSW für Vector Search)
-- Wird automatisch erstellt mit CREATE INDEX

-- ============================================
-- TABELLE: pigeons
-- Haupttabelle für registrierte Tauben
-- ============================================
CREATE TABLE pigeons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Location (jederzeit änderbar)
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_name VARCHAR(255),
    
    -- Metadata
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT true,
    
    -- Primary embedding (von erstem Foto)
    embedding vector(1024),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HNSW Index für Cosine Similarity Search
CREATE INDEX pigeons_embedding_idx ON pigeons 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- GIN Index für Full-Text Search auf Name
CREATE INDEX pigeons_name_search_idx ON pigeons 
USING gin(to_tsvector('german', name));

-- Spatial Index für Location Queries
CREATE INDEX pigeons_location_idx ON pigeons 
USING gist(point(location_lng, location_lat));

COMMENT ON TABLE pigeons IS 'Registrierte Tauben mit Embeddings für Similarity Search';
COMMENT ON COLUMN pigeons.embedding IS '1024-dimensionaler MobileNet V3 Feature Vector';

-- ============================================
-- TABELLE: images
-- Alle Bilder (Original + Sighting Photos)
-- ============================================
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pigeon_id UUID REFERENCES pigeons(id) ON DELETE CASCADE,
    sighting_id UUID,  -- FK zu sightings (später)
    
    -- Image metadata
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    
    -- Embedding (optional, für bessere Matches)
    embedding vector(1024),
    
    -- Flags
    is_primary BOOLEAN DEFAULT false,  -- Hauptbild der Taube
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Embedding Index auch für images
CREATE INDEX images_embedding_idx ON images 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Schneller Lookup nach pigeon_id
CREATE INDEX images_pigeon_idx ON images(pigeon_id);

COMMENT ON TABLE images IS 'Bilder der Tauben, mit Embeddings für Multi-Angle Matching';

-- ============================================
-- TABELLE: sightings
-- Sichtungen von Tauben
-- ============================================
CREATE TABLE sightings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pigeon_id UUID REFERENCES pigeons(id) ON DELETE CASCADE,
    
    -- Location
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    location_name VARCHAR(255),
    
    -- Observation
    notes TEXT,
    condition VARCHAR(100),  -- 'healthy', 'injured', 'unknown'
    
    -- Timestamp
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für schnelle Sightings pro Taube
CREATE INDEX sightings_pigeon_idx ON sightings(pigeon_id);
CREATE INDEX sightings_timestamp_idx ON sightings(timestamp DESC);

-- Spatial Index
CREATE INDEX sightings_location_idx ON sightings 
USING gist(point(location_lng, location_lat));

COMMENT ON TABLE sightings IS 'Sichtungen von registrierten Tauben';

-- ============================================
-- Trigger: images.sighting_id FK hinzufügen
-- ============================================
ALTER TABLE images 
ADD CONSTRAINT images_sighting_fk 
FOREIGN KEY (sighting_id) REFERENCES sightings(id) ON DELETE CASCADE;

-- ============================================
-- Trigger: updated_at automatisch aktualisieren
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pigeons_updated_at 
    BEFORE UPDATE ON pigeons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEW: pigeons_with_stats
-- Join für schnelle Statistiken
-- ============================================
CREATE VIEW pigeons_with_stats AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.location_lat,
    p.location_lng,
    p.location_name,
    p.first_seen,
    p.is_public,
    p.created_at,
    p.updated_at,
    COUNT(DISTINCT s.id) as sightings_count,
    COUNT(DISTINCT i.id) as images_count,
    MAX(s.timestamp) as last_seen
FROM pigeons p
LEFT JOIN sightings s ON p.id = s.pigeon_id
LEFT JOIN images i ON p.id = i.pigeon_id
GROUP BY p.id;

COMMENT ON VIEW pigeons_with_stats IS 'Tauben mit aggregierten Statistiken';

-- ============================================
-- FUNCTION: find_similar_pigeons
-- Findet ähnliche Tauben via Cosine Similarity
-- ============================================
CREATE OR REPLACE FUNCTION find_similar_pigeons(
    query_embedding vector(1024),
    match_threshold FLOAT DEFAULT 0.80,
    max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.description,
        (1 - (p.embedding <=> query_embedding))::FLOAT as similarity
    FROM pigeons p
    WHERE p.embedding IS NOT NULL
      AND (1 - (p.embedding <=> query_embedding)) >= match_threshold
    ORDER BY p.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Verwendung:
-- SELECT * FROM find_similar_pigeons('[0.1, 0.2, ...]'::vector(1024), 0.80, 5);