DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM _migrations WHERE name = '003_views_unique') THEN
    DELETE FROM views v1 USING views v2
      WHERE v1.id < v2.id
      AND v1.post_id = v2.post_id
      AND v1.ip_address = v2.ip_address;

    ALTER TABLE views ADD CONSTRAINT views_post_id_ip_address_key UNIQUE (post_id, ip_address);

    INSERT INTO _migrations (name) VALUES ('003_views_unique');
  END IF;
END $$;
