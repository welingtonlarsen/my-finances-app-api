-- This is an empty migration.

-- Initial State
INSERT INTO "PaymentMethod" (name) VALUES ('Cartão de crédito');
INSERT INTO "PaymentMethod" (name) VALUES ('Cartão de débito');
INSERT INTO "PaymentMethod" (name) VALUES ('PIX');
INSERT INTO "PaymentMethod" (name) VALUES ('Dinheiro');

INSERT INTO "Category" (name) VALUES ('Moradia');
INSERT INTO "Category" (name) VALUES ('Alimentação');
INSERT INTO "Category" (name) VALUES ('Transporte');
INSERT INTO "Category" (name) VALUES ('Saúde');
INSERT INTO "Category" (name) VALUES ('Entretenimento');
INSERT INTO "Category" (name) VALUES ('Vestuário');
INSERT INTO "Category" (name) VALUES ('Investimentos');
INSERT INTO "Category" (name) VALUES ('Seguros');
INSERT INTO "Category" (name) VALUES ('Estética');
INSERT INTO "Category" (name) VALUES ('Caridade');
INSERT INTO "Category" (name) VALUES ('Outros');