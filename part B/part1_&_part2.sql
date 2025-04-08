CREATE DATABASE people;

USE people;
DROP TABLE Persons;


CREATE TABLE IF NOT EXISTS Persons (
    Person_Id INT PRIMARY KEY,
    Personal_Name VARCHAR(50),
    Family_Name VARCHAR(50),
    Gender VARCHAR(10),
    Father_Id INT NOT NULL,
    Mother_Id INT NOT NULL,
    Spouse_Id INT
);

INSERT INTO Persons (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id) VALUES
(1, 'John',     'Smith',     'Male',   20, 21, 2),
(2, 'Mary',     'Smith',     'Female', 22, 23, NULL),
(3, 'Emily',    'Smith',     'Female', 1,    2,    NULL),
(4, 'David',    'Smith',     'Male',   1,    2,    3),
(5, 'Michael',  'Brown',     'Male',   24, 25, 6),
(6, 'Sarah',    'Brown',     'Female', 26, 27, 5),
(7, 'Anna',     'Brown',     'Female', 5,    6,    NULL),
(8, 'James',    'Brown',     'Male',   5,    6,    9),
(9, 'Laura',    'White',     'Female', 28, 29, 8),
(10,'Daniel',   'Smith',     'Male',   1,    2,    NULL);

# exs 1:

SELECT p.Person_Id, p.Father_Id, 'father'
FROM Persons p
WHERE p.Father_Id IS NOT NULL

UNION ALL

SELECT p.Person_Id, p.Mother_Id, 'mother'
FROM Persons p
WHERE p.Mother_Id IS NOT NULL

#(son, daughter)
UNION ALL
SELECT p.Father_Id, p.Person_Id, 
       CASE WHEN p.Gender = 'Male' THEN 'son' ELSE 'daughter' END
FROM Persons p
WHERE p.Father_Id IS NOT NULL

UNION ALL
SELECT p.Mother_Id, p.Person_Id, 
       CASE WHEN p.Gender = 'Male' THEN 'son' ELSE 'daughter' END
FROM Persons p
WHERE p.Mother_Id IS NOT NULL

#(brother, sister)
UNION ALL
SELECT p1.Person_Id, p2.Person_Id,
       CASE WHEN p2.Gender = 'Male' THEN 'brother' ELSE 'sister' END
FROM Persons p1
JOIN Persons p2 ON p1.Person_Id <> p2.Person_Id
WHERE (
        (p1.Father_Id IS NOT NULL AND p1.Father_Id = p2.Father_Id) OR
        (p1.Mother_Id IS NOT NULL AND p1.Mother_Id = p2.Mother_Id)
      )
  AND p2.Gender IN ('Male', 'Female')

#(husband, wife)
UNION ALL
SELECT p.Person_Id, p.Spouse_Id,
       CASE WHEN p.Gender = 'Male' THEN 'wife' ELSE 'husband' END
FROM Persons p
WHERE p.Spouse_Id IS NOT NULL;


# exs 2:
select * from persons;

SET SQL_SAFE_UPDATES = 0;
UPDATE Persons p1
JOIN Persons p2 ON p1.Person_Id = p2.Spouse_Id
SET p1.Spouse_Id = p2.Person_Id
WHERE p1.Spouse_Id IS NULL;
SET SQL_SAFE_UPDATES = 1;

select * from persons
