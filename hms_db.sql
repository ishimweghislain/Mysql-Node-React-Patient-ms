-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2025 at 12:56 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hms_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `ID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Specialization` varchar(100) NOT NULL,
  `Phone_Number` varchar(15) NOT NULL,
  `Email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`ID`, `Name`, `Specialization`, `Phone_Number`, `Email`) VALUES
(7, 'Mugabo', 'Mugabo', '+250798236526', 'mugabopaul380@gmail.com'),
(8, 'Byagatonda', 'destinee', '0780329088', 'muzu.joel@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `ID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Date_of_Birth` date NOT NULL,
  `Phone_Number` varchar(15) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Sex` enum('Male','Female','Other') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`ID`, `Name`, `Date_of_Birth`, `Phone_Number`, `Address`, `Sex`) VALUES
(1, 'mugabo paul', '2025-05-14', '0780329089', 'RWANDA', 'Male'),
(2, 'Byagatonda muzungu joel', '0000-00-00', '0780329089', 'Nyagatare-rwemiyaga', 'Female'),
(3, 'kellen', '2025-05-14', '0780329089', 'RWANDA', 'Female'),
(4, 'muga', '2025-05-14', '07803290867', 'RWANDA', 'Male'),
(5, 'mugabo paul', '0000-00-00', '0780329089', 'RWANDA', 'Female'),
(6, 'Mugabo mugabopaul30', '2025-05-16', '0798236526', 'Nyagatare-rwemiyaga', 'Male'),
(7, 'Byagatonda muzungu joel', '2025-05-14', '0780329089', 'Nyagatare-rwemiyaga', 'Female');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `ID` int(11) NOT NULL,
  `Patient_ID` int(11) NOT NULL,
  `Doctor_ID` int(11) NOT NULL,
  `Date` date NOT NULL,
  `Findings` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` enum('Admin','Doctor','Staff') NOT NULL,
  `Email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `Username`, `Password`, `Role`, `Email`) VALUES
(36, 'byiringiro daema ', '$2b$10$092.YcMYo2BugMvJ56vSOusUFfUaPqbX7MzmaDtxYuZJoTDU.rZTy', 'Admin', 'daema@gmail.com'),
(40, 'lois', '$2b$10$tCgznDT7E0pXevG3wUud/ey2bypGbKfiVeR0.J7S9IzZ0/zxD97dW', 'Doctor', 'lois@gmail.com'),
(46, 'Mpano', '$2b$10$fC9mSkvLGqCC6eP7wyshOO74ECNkBxSGUSn9Wj4PIjkMu5kJ8eLH6', 'Doctor', 'mano@gmail.com'),
(51, 'arsene', '$2b$10$XGZely.ttFR7857w21i.ieWS1oEenpPDIjnqWeF/Notciu4WW7eQm', 'Doctor', 'arsene@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Patient_ID` (`Patient_ID`),
  ADD KEY `Doctor_ID` (`Doctor_ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`Patient_ID`) REFERENCES `patients` (`ID`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`Doctor_ID`) REFERENCES `doctors` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
