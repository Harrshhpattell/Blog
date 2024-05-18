-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 18, 2024 at 08:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `blog`
--

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `notification_type` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `sender_id`, `post_id`, `notification_type`, `content`, `created_at`) VALUES
(9, 4, 2, 'like', 'liked your blog post.', '2024-05-18 06:14:52');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `img` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `uid` int(11) NOT NULL,
  `cat` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `title`, `description`, `img`, `date`, `uid`, `cat`) VALUES
(2, 'How Oil Painter Mary Kamerer Uses Artwork Archive Reports in Her Art Business Workflow', '<p><a href=\"https://www.artworkarchive.com/profile/mary-kamerer-558b8ad2-bfbc-419d-9031-9f81f5af6fcb/portfolio\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(0, 140, 186); background-color: rgba(0, 0, 0, 0);\"><em>Mary Kamerer</em></a><em>&nbsp;is an impressionist oil painter and solopreneur based in Charlotte, North Carolina, where she&nbsp;paints landscapes of the surrounding areas, especially the Blue Ridge mountains.</em></p><p><br></p><p>Her artwork has been collected nationally and featured in publications such as&nbsp;<a href=\"https://www.americanartcollector.com/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(0, 140, 186); background-color: rgba(0, 0, 0, 0);\">American Art Collector,</a>&nbsp;Fredericksburg Literary Review, Art Guide Artists Directory, Ballantyne Magazine,&nbsp;<a href=\"https://voyageatl.com/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: rgb(0, 140, 186); background-color: rgba(0, 0, 0, 0);\">VoyageATL</a>, SouthPark Magazine', '1716012242901pexels-daiangan-102127.jpg', '2024-05-18 11:33:11', 3, 'art'),
(3, 'OpenAI created a team to control ‘superintelligent’ AI — then let it wither, source says', '<p>OpenAI’s&nbsp;<a href=\"https://techcrunch.com/2023/07/05/openai-is-forming-a-new-team-to-bring-superintelligent-ai-under-control/\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"color: var(--wp--preset--color--green-900);\">Superalignment team</a>, responsible for developing ways to govern and steer “superintelligent” AI systems, was promised 20% of the company’s compute resources, according to a person from that team. But requests for a fraction of that compute were often denied, blocking the team from doing their work.</p><p>That issue, among others, pushed several team members to resign this week, including co-lead Jan Leike, a former DeepMind researcher who while at OpenAI was involved with the development of ChatGPT, GPT-4 and ChatGPT’s predecessor, InstructGPT.</p><p><br></p>', '1716012377805pexels-andrew-15863000.jpg', '2024-05-18 11:36:17', 3, 'technology');

-- --------------------------------------------------------

--
-- Table structure for table `postlike`
--

CREATE TABLE `postlike` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `postid` int(11) NOT NULL,
  `liked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `postlike`
--

INSERT INTO `postlike` (`id`, `userid`, `postid`, `liked_at`) VALUES
(9, 4, 2, '2024-05-18 06:14:52');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `img`) VALUES
(3, 'hellouser', 'hellouser@gmail.com', '$2a$10$XOUehDdMGSUwf5PLXyYwtek93uhM9Dp.619lhPeemds1KP18h.WV2', NULL),
(4, 'harsh', 'harsh@gmail.com', '$2a$10$3kaVu5DLt0MwnyewM8HwreU8S6NP/FOKrhPhxMQGMwQxWU5aRfyAa', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`);

--
-- Indexes for table `postlike`
--
ALTER TABLE `postlike`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`),
  ADD KEY `postid` (`postid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `postlike`
--
ALTER TABLE `postlike`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`id`);

--
-- Constraints for table `postlike`
--
ALTER TABLE `postlike`
  ADD CONSTRAINT `postlike_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postlike_ibfk_2` FOREIGN KEY (`postid`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
