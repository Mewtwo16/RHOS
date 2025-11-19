SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema RHOS
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `RHOS` DEFAULT CHARACTER SET utf8 ;
USE `RHOS` ;

-- -----------------------------------------------------
-- Table `RHOS`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RHOS`.`users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(255) NOT NULL,     
  `email` VARCHAR(255) NOT NULL,
  `login` VARCHAR(45) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `birth_date` DATE NOT NULL,            
  `status` TINYINT NOT NULL,
  `creation_date` DATETIME NOT NULL,    
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `users_login_UNIQUE` (`login` ASC) VISIBLE,
  UNIQUE INDEX `users_cpf_UNIQUE` (`cpf` ASC) VISIBLE
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `RHOS`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RHOS`.`roles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(255) NOT NULL,     
  `description` VARCHAR(255) NULL,       
  PRIMARY KEY (`id`),
  UNIQUE INDEX `roles_name_UNIQUE` (`role_name` ASC) VISIBLE
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `RHOS`.`allowed` 
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RHOS`.`allowed` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `permission_name` VARCHAR(255) NOT NULL, 
  PRIMARY KEY (`id`),
  UNIQUE INDEX `allowed_name_UNIQUE` (`permission_name` ASC) VISIBLE 
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `RHOS`.`role_users` 
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RHOS`.`role_users` (
  `users_id` INT UNSIGNED NOT NULL,
  `roles_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`users_id`, `roles_id`),
  INDEX `fk_role_users_roles_idx` (`roles_id` ASC) VISIBLE, 
  INDEX `fk_role_users_users_idx` (`users_id` ASC) VISIBLE, 
  CONSTRAINT `fk_role_users_users` 
    FOREIGN KEY (`users_id`)
    REFERENCES `RHOS`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_role_users_roles`
    FOREIGN KEY (`roles_id`)
    REFERENCES `RHOS`.`roles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `RHOS`.`roles_allowed`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RHOS`.`roles_allowed` (
  `roles_id` INT UNSIGNED NOT NULL,
  `allowed_id` INT NOT NULL,
  PRIMARY KEY (`roles_id`, `allowed_id`),
  INDEX `fk_roles_allowed_allowed_idx` (`allowed_id` ASC) VISIBLE,
  INDEX `fk_roles_allowed_roles_idx` (`roles_id` ASC) VISIBLE,  
  CONSTRAINT `fk_roles_allowed_roles`
    FOREIGN KEY (`roles_id`)
    REFERENCES `RHOS`.`roles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_roles_allowed_allowed` 
    FOREIGN KEY (`allowed_id`)
    REFERENCES `RHOS`.`allowed` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `RHOS`.`audit_logs`
-- -----------------------------------------------------
-- Table `RHOS`.`audit_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RHOS`.`audit_logs` ( 
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL,
  `who` VARCHAR(255) NULL,
  `where` VARCHAR(255) NOT NULL,
  `when` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `what` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_audit_logs_user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_audit_logs_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `RHOS`.`users` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


-- -----------------------------------------------------
-- Table `RHOS`.`cargos_clt`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RHOS`.`cargos_clt` (
  `id_cargo` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome_cargo` VARCHAR(100) NOT NULL,
  `descricao` TEXT NULL,
  `salario_base` DECIMAL(10,2) NOT NULL,
  `carga_horaria_semanal` INT UNSIGNED DEFAULT 44,
  `nivel` VARCHAR(50) NULL,
  `departamento` VARCHAR(100) NULL,
  `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ativo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_cargo`),
  INDEX `idx_nome_cargo` (`nome_cargo` ASC) VISIBLE,
  INDEX `idx_ativo` (`ativo` ASC) VISIBLE
) ENGINE = InnoDB DEFAULT CHARSET=utf8;

-- -----------------------------------------------------
-- Table `RHOS`.`funcionarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `RHOS`.`funcionarios` (
  `id_funcionario` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  
  -- Dados Pessoais
  `nome_completo` VARCHAR(200) NOT NULL,
  `cpf` VARCHAR(14) NOT NULL,
  `rg` VARCHAR(20) NULL,
  `data_nascimento` DATE NOT NULL,
  `sexo` VARCHAR(20) NULL,
  `estado_civil` VARCHAR(30) NULL,
  `nacionalidade` VARCHAR(50) DEFAULT 'Brasileiro',
  
  -- Contato
  `telefone` VARCHAR(20) NULL,
  `email` VARCHAR(100) NULL,
  
  -- Endereço
  `cep` VARCHAR(10) NULL,
  `logradouro` VARCHAR(200) NULL,
  `numero` VARCHAR(10) NULL,
  `complemento` VARCHAR(100) NULL,
  `bairro` VARCHAR(100) NULL,
  `cidade` VARCHAR(100) NULL,
  `estado` VARCHAR(2) NULL,
  
  -- Dados Trabalhistas
  `id_cargo` INT UNSIGNED NOT NULL,
  `data_admissao` DATE NOT NULL,
  `data_demissao` DATE NULL,
  `status` VARCHAR(20) DEFAULT 'ativo',
  `tipo_contrato` VARCHAR(30) DEFAULT 'CLT',
  
  -- Dados Bancários
  `banco` VARCHAR(100) NULL,
  `agencia` VARCHAR(10) NULL,
  `conta` VARCHAR(20) NULL,
  `tipo_conta` VARCHAR(20) NULL,
  
  -- Dados de Pagamento
  `salario_atual` DECIMAL(10,2) NOT NULL,
  `vale_transporte` TINYINT(1) DEFAULT 0,
  `vale_alimentacao` DECIMAL(10,2) DEFAULT 0,
  `plano_saude` TINYINT(1) DEFAULT 0,
  `plano_odonto` TINYINT(1) DEFAULT 0,
  
  -- Dependentes para IR
  `numero_dependentes` INT UNSIGNED DEFAULT 0,
  
  -- Documentos
  `ctps_numero` VARCHAR(20) NULL,
  `ctps_serie` VARCHAR(20) NULL,
  `ctps_uf` VARCHAR(2) NULL,
  `pis_pasep` VARCHAR(20) NULL,
  `titulo_eleitor` VARCHAR(20) NULL,
  `observacoes` TEXT NULL,
  
  -- Metadados
  `data_cadastro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_atualizacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id_funcionario`),
  UNIQUE INDEX `funcionarios_cpf_UNIQUE` (`cpf` ASC) VISIBLE,
  INDEX `fk_funcionarios_cargo_idx` (`id_cargo` ASC) VISIBLE,
  INDEX `idx_status` (`status` ASC) VISIBLE,
  INDEX `idx_nome` (`nome_completo` ASC) VISIBLE,
  CONSTRAINT `fk_funcionarios_cargo`
    FOREIGN KEY (`id_cargo`)
    REFERENCES `RHOS`.`cargos_clt` (`id_cargo`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;




-- Insert usuario + role

INSERT INTO RHOS.roles (role_name, description)
VALUES ('Administrador', 'Administrador do sistema')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Adiministrador login: admin senha: admin123
INSERT INTO RHOS.users (full_name, email, login, password_hash, cpf, birth_date, status, creation_date)
VALUES ('Admin Teste', 'admin@teste.com', 'admin', '$2b$10$DeecaPnSsA.AVxygB6oIdu3hbNoQVmIysbYEdg5/9rKrsuw7JEzdC', '12345678901', '1990-01-01', 1, NOW());
INSERT INTO RHOS.role_users (users_id, roles_id)
SELECT u.id, r.id
FROM RHOS.users u
JOIN RHOS.roles r ON r.role_name = 'Administrador'
WHERE u.login = 'admin'
ON DUPLICATE KEY UPDATE users_id = users_id;

INSERT INTO RHOS.allowed (permission_name) VALUES
  -- Users
  ('users:create'),
  ('users:read'),
  ('users:update'),
  ('users:delete'),
  ('users:view'),
  -- Roles
  ('roles:create'),
  ('roles:read'),
  ('roles:update'),
  ('roles:delete'),
  ('roles:view'),
  -- Permissions
  ('permissions:view'),
  -- Logs (apenas leitura e visualização)
  ('logs:read'),
  ('logs:view'),
  -- Cargos CLT
  ('cargos:create'),
  ('cargos:read'),
  ('cargos:update'),
  ('cargos:delete'),
  ('cargos:view'),
  -- Funcionários
  ('funcionarios:create'),
  ('funcionarios:read'),
  ('funcionarios:update'),
  ('funcionarios:delete'),
  ('funcionarios:view'),
  ('funcionarios:calcular')
ON DUPLICATE KEY UPDATE permission_name = VALUES(permission_name);

INSERT INTO RHOS.roles_allowed (roles_id, allowed_id)
SELECT r.id, a.id
FROM RHOS.roles r
JOIN RHOS.allowed a ON a.permission_name IN (
  -- Users
  'users:create',
  'users:read',
  'users:update',
  'users:delete',
  'users:view',
  -- Roles
  'roles:create',
  'roles:read',
  'roles:update',
  'roles:delete',
  'roles:view',
  -- Permissions
  'permissions:view',
  -- Logs
  'logs:read',
  'logs:view',
  -- Cargos CLT
  'cargos:create',
  'cargos:read',
  'cargos:update',
  'cargos:delete',
  'cargos:view',
  -- Funcionários
  'funcionarios:create',
  'funcionarios:read',
  'funcionarios:update',
  'funcionarios:delete',
  'funcionarios:view',
  'funcionarios:calcular'
)
WHERE r.role_name = 'Administrador'
ON DUPLICATE KEY UPDATE roles_id = roles_id;

