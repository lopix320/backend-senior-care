[24/11/2024, 23:04:42] Gabriel Lopes: -- DROP SCHEMA "SENIOR_CARE";

CREATE SCHEMA "SENIOR_CARE" AUTHORIZATION postgres;

-- DROP SEQUENCE "SENIOR_CARE".contratacao_id_contratacao_seq;

CREATE SEQUENCE "SENIOR_CARE".contratacao_id_contratacao_seq
INCREMENT BY 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1
NO CYCLE;
-- DROP SEQUENCE "SENIOR_CARE".cuidadores_id_cuidador_seq;

CREATE SEQUENCE "SENIOR_CARE".cuidadores_id_cuidador_seq
INCREMENT BY 1
MINVALUE 1
MAXVALUE 2147483647
START 1
CACHE 1
NO CYCLE;
-- DROP SEQUENCE "SENIOR_CARE".enderecos_id_endereco_seq;

CREATE SEQUENCE "SENIOR_CARE".enderecos_id_endereco_seq
INCREMENT BY 1
MINVALUE 1
MAXVALUE 2147483647
START 1
CACHE 1
NO CYCLE;
-- DROP SEQUENCE "SENIOR_CARE".idosos_id_idoso_seq;

CREATE SEQUENCE "SENIOR_CARE".idosos_id_idoso_seq
INCREMENT BY 1
MINVALUE 1
MAXVALUE 2147483647
START 1
CACHE 1
NO CYCLE;
-- DROP SEQUENCE "SENIOR_CARE".paciente_servico_id_paciente_servico_seq;

CREATE SEQUENCE "SENIOR_CARE".paciente_servico_id_paciente_servico_seq
INCREMENT BY 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1
NO CYCLE;
-- DROP SEQUENCE "SENIOR_CARE".servicos_id_servicos_seq;

CREATE SEQUENCE "SENIOR_CARE".servicos_id_servicos_seq
INCREMENT BY 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1
NO CYCLE;
-- DROP SEQUENCE "SENIOR_CARE".usuarios_id_usuario_seq;

CREATE SEQUENCE "SENIOR_CARE".usuarios_id_usuario_seq
INCREMENT BY 1
MINVALUE 1
MAXVALUE 2147483647
START 1
CACHE 1
NO CYCLE;-- "SENIOR_CARE".endereco definição

-- Drop table

-- DROP TABLE "SENIOR_CARE".endereco;

CREATE TABLE "SENIOR_CARE".endereco (
id_endereco int4 DEFAULT nextval('"SENIOR_CARE".enderecos_id_endereco_seq'::regclass) NOT NULL,
rua varchar(255) NOT NULL,
cidade varchar(100) NOT NULL,
estado varchar(100) NOT NULL,
cep varchar(20) NOT NULL,
CONSTRAINT enderecos_pkey PRIMARY KEY (id_endereco)
);

-- "SENIOR_CARE".servico definição

-- Drop table

-- DROP TABLE "SENIOR_CARE".servico;

CREATE TABLE "SENIOR_CARE".servico (
id_servico int8 DEFAULT nextval('"SENIOR_CARE".servicos_id_servicos_seq'::regclass) NOT NULL,
descricao text NULL,
CONSTRAINT servicos_pk PRIMARY KEY (id_servico)
);

-- "SENIOR_CARE".usuario definição

-- Drop table

-- DROP TABLE "SENIOR_CARE".usuario;

CREATE TABLE "SENIOR_CARE".usuario (
id_usuario int4 DEFAULT nextval('"SENIOR_CARE".usuarios_id_usuario_seq'::regclass) NOT NULL,
nome varchar(100) NOT NULL,
cpf varchar(255) NOT NULL,
email varchar(100) NOT NULL,
senha varchar(255) NOT NULL,
numero_telefone varchar(255) NULL,
aceitou_termos bool DEFAULT false NULL,
created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
id_endereco int8 NOT NULL,
data_nascimento date NULL,
CONSTRAINT usuario_unique UNIQUE (id_endereco),
CONSTRAINT usuarios_cpf_key UNIQUE (cpf),
CONSTRAINT usuarios_email_key UNIQUE (email),
CONSTRAINT usuarios_pkey PRIMARY KEY (id_usuario),
CONSTRAINT usuario_enderecos_fk FOREIGN KEY (id_endereco) REFERENCES "SENIOR_CARE".endereco(id_endereco)
);

-- Table Triggers

create trigger atualizar_updated_at_trigger before
update
on
"SENIOR_CARE".usuario for each row execute function "SENIOR_CARE".atualizar_updated_at();

-- "SENIOR_CARE".cuidador definição

-- Drop table

-- DROP TABLE "SENIOR_CARE".cuidador;

CREATE TABLE "SENIOR_CARE".cuidador (
id_cuidador int4 DEFAULT nextval('"SENIOR_CARE".cuidadores_id_cuidador_seq'::regclass) NOT NULL,
id_usuario int4 NULL,
bio text NULL,
verificado bool DEFAULT false NULL,
curriculo varchar(255) NULL,
video_apresentacao varchar(255) NULL,
nivel_conta varchar(50) NOT NULL,
CONSTRAINT cuidadores_pkey PRIMARY KEY (id_cuidador),
CONSTRAINT cuidadores_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES "SENIOR_CARE".usuario(id_usuario) ON DELETE CASCADE
);

-- "SENIOR_CARE".paciente definição

-- Drop table

-- DROP TABLE "SENIOR_CARE".paciente;

CREATE TABLE "SENIOR_CARE".paciente (
id_paciente int4 DEFAULT nextval('"SENIOR_CARE".idosos_id_idoso_seq'::regclass) NOT NULL,
acomp_24 bool NOT NULL,
mobilidade_reduzida bool NOT NULL,
id_usuario int4 NULL,
acessibilidade bool NOT NULL,
CONSTRAINT idosos_pkey PRIMARY KEY (id_paciente),
CONSTRAINT idosos_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES "SENIOR_CARE".usuario(id_usuario) ON DELETE CASCADE
);

-- "SENIOR_CARE".paciente_servico definição

-- Drop table

-- DROP TABLE "SENIOR_CARE".paciente_servico;

CREATE TABLE "SENIOR_CARE".paciente_servico (
id_paciente_servico bigserial NOT NULL,
id_paciente int8 NOT NULL,
id_servico int8 NOT NULL,
CONSTRAINT paciente_servico_pk PRIMARY KEY (id_paciente_servico),
CONSTRAINT paciente_servico_unique_1 UNIQUE (id_servico),
CONSTRAINT paciente_servico_paciente_fk FOREIGN KEY (id_paciente) REFERENCES "SENIOR_CARE".paciente(id_paciente),
CONSTRAINT paciente_servico_servico_fk FOREIGN KEY (id_servico) REFERENCES "SENIOR_CARE".servico(id_servico)
);

-- "SENIOR_CARE".contratacao definição

-- Drop table

-- DROP TABLE "SENIOR_CARE".contratacao;

CREATE TABLE "SENIOR_CARE".contratacao (
id_contratacao bigserial NOT NULL,
id_paciente int8 NOT NULL,
id_cuidador int8 NOT NULL,
data_inicio date NULL,
data_fim date NULL,
confirmacao bool DEFAULT false NULL,
texto_avaliacao text NULL,
nota int4 DEFAULT 0 NULL,
CONSTRAINT contratacao_pk PRIMARY KEY (id_contratacao),
CONSTRAINT contratacao_cuidador_fk FOREIGN KEY (id_cuidador) REFERENCES "SENIOR_CARE".cuidador(id_cuidador),
CONSTRAINT contratacao_paciente_fk FOREIGN KEY (id_paciente) REFERENCES "SENIOR_CARE".paciente(id_paciente)
);

-- DROP FUNCTION "SENIOR_CARE".atualizar_updated_at();

CREATE OR REPLACE FUNCTION "SENIOR_CARE".atualizar_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$function$
;

-- DROP FUNCTION "SENIOR_CARE".valida_cpf(varchar);

CREATE OR REPLACE FUNCTION "SENIOR_CARE".valida_cpf(cpf_input character varying)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
DECLARE
soma INT;
resto INT;
digito1 INT;
digito2 INT;
cpf_array INTEGER[];
i INT;
BEGIN
-- Remover qualquer caractere que não seja número
cpf_input := regexp_replace(cpf_input, '[^0-9]', '', 'g');

    -- Verificar se o CPF tem 11 dígitos
    IF length(cpf_input) <> 11 THEN
        RETURN FALSE;
    END IF;

    -- Dividir o CPF em uma array de números inteiros
    cpf_array := string_to_array(cpf_input, NULL)::INTEGER[];

    -- Verificar se todos os números são iguais, como '11111111111', que é inválido
    IF array_length(array(SELECT DISTINCT x FROM unnest(cpf_array) AS x), 1) = 1 THEN
        RETURN FALSE;
    END IF;

    -- Cálculo do primeiro dígito verificador
    soma := 0;
    FOR i IN 1..9 LOOP
        soma := soma + cpf_array[i] * (11 - i);
    END LOOP;

    resto := (soma * 10) % 11;
    IF resto = 10 THEN
        digito1 := 0;
    ELSE
        digito1 := resto;
    END IF;

    -- Verificar se o primeiro dígito bate
    IF digito1 <> cpf_array[10] THEN
        RETURN FALSE;
    END IF;

    -- Cálculo do segundo dígito verificador
    soma := 0;
    FOR i IN 1..10 LOOP
        soma := soma + cpf_array[i] * (12 - i);
    END LOOP;

    resto := (soma * 10) % 11;
    IF resto = 10 THEN
        digito2 := 0;
    ELSE
        digito2 := resto;
    END IF;

    -- Verificar se o segundo dígito bate
    IF digito2 <> cpf_array[11] THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;

END;
$function$
;
[24/11/2024, 23:07:08] Gabriel Lopes: postgre 17
[24/11/2024, 23:07:41] Gabriel Lopes: node v20.11.1
[24/11/2024, 23:08:09] Gabriel Lopes: flutter 3.10.0
[24/11/2024, 23:08:19] Gabriel Lopes: dart 3.0.0
