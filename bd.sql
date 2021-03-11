CREATE SCHEMA `squad5`;
USE `squad5`;
  
CREATE TABLE `squad5`.`comentarios` (
  `id` int AUTO_INCREMENT,
  `nome` varchar(100),
  `sobrenome` varchar(100),
  `msg` varchar(300),
  `data` datetime default now(),
  PRIMARY KEY (`id`)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `squad5`.`login` (
  `idnome` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `senha` varchar(200) NOT NULL,
  `audit` int,
  PRIMARY KEY (`idnome`))
  ENGINE=InnoDB DEFAULT CHARSET=utf8;
               
               
  CREATE TABLE `squad5`.`monitoramento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `q1` int,
  `q2` int,
  `q3` int,
  PRIMARY KEY (`id`))
