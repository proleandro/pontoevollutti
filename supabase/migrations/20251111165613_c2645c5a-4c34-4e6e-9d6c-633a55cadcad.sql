
-- Corrigir horas líquidas da semana 02/11 a 06/11/2025
-- Regra: desconta 1h de almoço apenas se trabalhou entre 11:59 e 12:59

-- Hannah - 03/11: 11:17 às 19:30 = 8.22h - 1h almoço = 7.22h
UPDATE ponto_registros 
SET horas_liquidas = 7.22, updated_at = now()
WHERE id = '718fdc43-53f3-40e9-ae2e-51292a4c04f0';

-- Hannah - 04/11: 13:00 às 21:00 = 8h (sem desconto, começou depois do almoço)
UPDATE ponto_registros 
SET horas_liquidas = 8.00, updated_at = now()
WHERE id = 'e805703b-bec6-4764-9c5e-3ffd7f878bce';

-- Hannah - 05/11: 11:16 às 17:05 = 5.82h - 1h almoço = 4.82h
UPDATE ponto_registros 
SET horas_liquidas = 4.82, updated_at = now()
WHERE id = 'e97d067a-a87c-4091-89d6-e5649c0ed2bc';

-- Júlia - 03/11: 13:05 às 19:30 = 6.42h (sem desconto, começou depois do almoço)
UPDATE ponto_registros 
SET horas_liquidas = 6.42, updated_at = now()
WHERE id = 'c0bafc2a-2f90-4c34-87ff-855938bf4dce';

-- Júlia - 04/11: 16:00 às 21:00 = 5h (sem desconto)
UPDATE ponto_registros 
SET horas_liquidas = 5.00, updated_at = now()
WHERE id = '86e707e6-bbd3-434b-862b-83acb5d1f89b';

-- Júlia - 06/11: 16:00 às 21:00 = 5h (sem desconto)
UPDATE ponto_registros 
SET horas_liquidas = 5.00, updated_at = now()
WHERE id = '1527f91d-86ba-4fd0-85a6-24a4c6178806';

-- Thaíssa - 03/11: 13:05 às 19:31 = 6.43h (sem desconto, começou depois do almoço)
UPDATE ponto_registros 
SET horas_liquidas = 6.43, updated_at = now()
WHERE id = 'fa8340c9-9404-44f1-bf3d-1dc27eeaf314';

-- Thaíssa - 05/11: 11:00 às 19:32 = 8.53h - 1h almoço = 7.53h
UPDATE ponto_registros 
SET horas_liquidas = 7.53, updated_at = now()
WHERE id = '6e75e02d-f0b2-4f87-bb6e-56cbf7c2196e';

-- Thaíssa - 06/11: 16:00 às 21:02 = 5.03h (sem desconto)
UPDATE ponto_registros 
SET horas_liquidas = 5.03, updated_at = now()
WHERE id = '9cb4d4ab-c32f-4b8d-b604-204aec27baf1';

-- Thiago - 03/11: 10:29 às 19:00 = 8.52h - 1h almoço = 7.52h
UPDATE ponto_registros 
SET horas_liquidas = 7.52, updated_at = now()
WHERE id = 'eeb323ed-8dfa-4810-9957-f3e315b60fa3';

-- Thiago - 04/11: 10:30 às 19:00 = 8.50h - 1h almoço = 7.50h
UPDATE ponto_registros 
SET horas_liquidas = 7.50, updated_at = now()
WHERE id = '73276b5b-80dd-4a62-8dc9-457a2d10605d';

-- Thiago - 05/11: 10:30 às 19:00 = 8.50h - 1h almoço = 7.50h
UPDATE ponto_registros 
SET horas_liquidas = 7.50, updated_at = now()
WHERE id = '705aeb7b-d311-4733-8e0b-435c6a868e13';

-- Thiago - 06/11: 10:30 às 19:01 = 8.52h - 1h almoço = 7.52h
UPDATE ponto_registros 
SET horas_liquidas = 7.52, updated_at = now()
WHERE id = 'a528c0a5-6122-45eb-818c-f452c36fd551';
