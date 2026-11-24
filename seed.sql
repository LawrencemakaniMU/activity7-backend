-- Inserts the starting records only when the table is empty, so running it twice is safe.
INSERT INTO records (title, category, description, status)
SELECT * FROM (VALUES
  ('Wi-Fi drops in Lab 3', 'Network', 'The wireless connection in Computer Lab 3 disconnects every few minutes.', 'Pending'),
  ('Install MATLAB on lab PCs', 'Software', 'Ten lab computers need MATLAB installed before the simulation class.', 'In progress'),
  ('Broken keyboard at desk 14', 'Hardware', 'Several keys on the keyboard at desk 14 do not respond.', 'Completed'),
  ('Projector will not connect', 'Hardware', 'The projector in Room B12 shows no signal from the lecturer laptop.', 'Pending'),
  ('Cannot log in to student portal', 'Software', 'A student reports the portal rejects the correct password.', 'In progress'),
  ('Slow internet in library', 'Network', 'Downloads in the library are very slow in the afternoon.', 'Pending'),
  ('Printer jams on page two', 'Hardware', 'The staff room printer jams every time it prints a double-sided page.', 'Completed'),
  ('Antivirus update failing', 'Software', 'The antivirus update stops with an error on the admin office computers.', 'In progress')
) AS v(title, category, description, status)
WHERE NOT EXISTS (SELECT 1 FROM records);
