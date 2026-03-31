CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  channel VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT now()
);
