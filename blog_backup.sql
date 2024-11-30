-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: blog
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_posttotag`
--

DROP TABLE IF EXISTS `_posttotag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_posttotag` (
  `A` int NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_PostToTag_AB_unique` (`A`,`B`),
  KEY `_PostToTag_B_index` (`B`),
  CONSTRAINT `_PostToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_PostToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_posttotag`
--

LOCK TABLES `_posttotag` WRITE;
/*!40000 ALTER TABLE `_posttotag` DISABLE KEYS */;
INSERT INTO `_posttotag` VALUES (1,'cm42dqg3r00004qy7usez0nmj');
/*!40000 ALTER TABLE `_posttotag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0a3be375-3fa9-463f-911b-b96338f28626','88bc15682c7fab02035aa6a7a6b1ff31fa65fd2b6b7e256104c5b150265207a0','2024-11-29 06:44:42.489','20241129064442_add_recipe_flag',NULL,NULL,'2024-11-29 06:44:42.228',1),('961e4348-0234-4cd1-ba81-2880e76fc739','fa55c6fac2437ff38697c2a6b73fcd10d52c99412add57a909bcc83a0860d37a','2024-11-29 06:44:40.769','20241128055705_init',NULL,NULL,'2024-11-29 06:44:40.117',1),('bb6cb7dc-4989-407e-83fd-c1554af445f8','143a8dfb66dcc4b9aaa635b0d493639b69e0c582ff13947c0b72fd94e4f6c6b4','2024-11-29 10:07:44.238','20241129100744_add_description',NULL,NULL,'2024-11-29 10:07:44.214',1),('e19d9f92-2228-4913-af86-67f8322bd4a8','f11fc08d52a9c3dcec2256849aa0c493c58f1dc196a5c7d0b10b027fd351109c','2024-11-29 07:13:57.583','20241129071357_blog',NULL,NULL,'2024-11-29 07:13:57.495',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_recipetotag`
--

DROP TABLE IF EXISTS `_recipetotag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_recipetotag` (
  `A` int NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_RecipeToTag_AB_unique` (`A`,`B`),
  KEY `_RecipeToTag_B_index` (`B`),
  CONSTRAINT `_RecipeToTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `recipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_RecipeToTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_recipetotag`
--

LOCK TABLES `_recipetotag` WRITE;
/*!40000 ALTER TABLE `_recipetotag` DISABLE KEYS */;
/*!40000 ALTER TABLE `_recipetotag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'style','Style',NULL,'#57c4ff31','cat_style.jpg','2024-11-29 06:45:40.512','2024-11-29 06:45:40.512'),(2,'fashion','Fashion',NULL,'#da85c731','cat_fashion.jpg','2024-11-29 06:45:40.524','2024-11-29 06:45:40.524'),(3,'food','Food',NULL,'#7fb88133','cat_food.jpg','2024-11-29 06:45:40.541','2024-11-29 06:45:40.541'),(4,'travel','Travel',NULL,'#ff795736','cat_travel.jpg','2024-11-29 06:45:40.552','2024-11-29 06:45:40.552'),(5,'culture','Culture',NULL,'#ffb04f45','cat_culture.jpg','2024-11-29 06:45:40.564','2024-11-29 06:45:40.564'),(6,'coding','Coding',NULL,'#5e4fff31','cat_coding.jpg','2024-11-29 06:45:40.579','2024-11-29 06:45:40.579');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredient` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `unit` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipeId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Ingredient_recipeId_idx` (`recipeId`),
  CONSTRAINT `Ingredient_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipe` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredient`
--

LOCK TABLES `ingredient` WRITE;
/*!40000 ALTER TABLE `ingredient` DISABLE KEYS */;
INSERT INTO `ingredient` VALUES (1,'鱼',1,'条',1),(2,'Lorem',1,'他',2);
/*!40000 ALTER TABLE `ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutrition`
--

DROP TABLE IF EXISTS `nutrition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutrition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `calories` double DEFAULT NULL,
  `protein` double DEFAULT NULL,
  `carbs` double DEFAULT NULL,
  `fat` double DEFAULT NULL,
  `fiber` double DEFAULT NULL,
  `recipeId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Nutrition_recipeId_key` (`recipeId`),
  CONSTRAINT `Nutrition_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipe` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutrition`
--

LOCK TABLES `nutrition` WRITE;
/*!40000 ALTER TABLE `nutrition` DISABLE KEYS */;
/*!40000 ALTER TABLE `nutrition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `views` int NOT NULL DEFAULT '0',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `authorId` int NOT NULL,
  `categoryId` int NOT NULL,
  `isRecipe` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `Post_slug_key` (`slug`),
  KEY `Post_authorId_fkey` (`authorId`),
  KEY `Post_categoryId_fkey` (`categoryId`),
  CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Post_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'开始学习Next.js开发','1732902778533-kāishǐ-7246','\n          Next.js是一个React框架，它使构建全栈Web应用变得简单。\n          \n          主要特点：\n          1. 服务器端渲染\n          2. 文件系统路由\n          3. API路由支持\n          4. 优化的图片处理\n          \n          让我们开始学习吧！\n        ','探索Next.js框架的基础知识和主要特性','nextjs-cover.png',100,1,1,'2024-11-29 06:45:40.744','2024-11-29 17:52:58.538',1,6,0),(3,'Lorem Ipsum','1732902778559-lorem-ipsum','<p class=\"ql-align-justify\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at lobortis sapien, vitae hendrerit dolor. Nulla scelerisque sapien eu risus lacinia, sed scelerisque ipsum condimentum. Sed at diam consectetur, semper justo sed, ultricies ipsum. Mauris scelerisque sapien sit amet risus pretium auctor. Pellentesque ac porttitor urna, eget tempor justo. Cras id accumsan eros, nec vehicula orci. Duis feugiat blandit lacus, eget varius sapien facilisis sed. Donec at nulla et sapien euismod pellentesque. Curabitur blandit suscipit neque, sed ornare mi porta ut. Vestibulum quis arcu luctus, placerat justo sagittis, sollicitudin ex. Fusce fermentum tortor tincidunt nisl scelerisque dignissim. Nam nisi mi, consectetur blandit faucibus ac, mollis egestas odio.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Etiam eget ante non diam pretium blandit et ut sem. Nunc ut tincidunt neque. Suspendisse mattis vel mauris a commodo. Sed molestie libero vitae tellus vehicula, a suscipit ex pellentesque. Curabitur malesuada ultricies magna, imperdiet porttitor diam aliquet sit amet. In vestibulum nulla in cursus lacinia. Etiam iaculis pretium mauris, in aliquet libero pellentesque a. Nunc sed viverra ligula, non lobortis felis. Sed dolor diam, commodo eu porta quis, faucibus vel purus. Mauris justo nulla, tincidunt sed facilisis nec, blandit nec lectus. Mauris sodales nulla eu augue semper luctus.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Ut convallis quam a magna hendrerit varius at eu quam. Curabitur aliquam gravida blandit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum odio sem, convallis vitae interdum at, laoreet dapibus metus. Nullam id lorem nisl. Curabitur non suscipit purus, eu sagittis nisi. In condimentum lacus at libero lobortis accumsan. Donec nec leo posuere, mattis ipsum lacinia, eleifend justo. Morbi imperdiet tempor ex vitae maximus. Duis vitae auctor nisl, et ullamcorper mi. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Donec laoreet magna eget turpis maximus scelerisque. Vestibulum aliquet ut leo vitae pharetra. Pellentesque viverra ante sit amet ipsum pulvinar, et blandit justo porttitor. Nulla facilisi. Aenean id tellus mollis, bibendum ante vitae, malesuada tellus. In hac habitasse platea dictumst. Cras eget viverra magna. Curabitur cursus orci id ipsum faucibus ornare. Donec ac malesuada metus.</p><p class=\"ql-align-justify\"><br></p><p class=\"ql-align-justify\">Etiam at vestibulum purus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam eu euismod ex, eu porttitor nisi. Integer at orci vitae leo consectetur venenatis at quis velit. In hac habitasse platea dictumst. Praesent eget velit ultricies, varius metus non, volutpat purus. Donec vel purus laoreet, laoreet felis et, posuere enim. Donec sed suscipit ligula, vitae varius elit. Donec varius suscipit velit. Donec cursus quam et arcu ultrices, sit amet fringilla leo vehicula. Duis eleifend pretium lacus, eget imperdiet sapien maximus quis. Maecenas luctus mi a lorem lobortis aliquet.</p><p><br></p>','Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...','uploads/1732877069479-OIP1.jpg',0,0,1,'2024-11-29 10:44:31.816','2024-11-29 17:52:58.560',1,6,0),(4,'我刚才去做大保健，为什么刚掏出医保卡就被赶出来了','1732902778578-wǒgāng-3b62','<p>他们觉得你用医保卡来支付大保健简直是对医保系统的莫大亵渎，于是决定以迅雷不及掩耳之势把你请出门外，以维护医保卡的尊严。</p><p><br></p><p>当然，还有一种可能性，那就是他们根本不懂得欣赏你的幽默感，误以为你是在开玩笑，于是干脆就把你赶了出去。</p><p><br></p><p>毕竟，在他们眼里，用医保卡来支付大保健的费用，简直就像是用金箔纸来包裹土豆一样荒谬。</p><p><br></p><p>无论真相如何，你的这次经历无疑为我们平凡的生活增添了一丝戏剧性的色彩。</p>','这真是个令人费解的谜团！或许是因为你的医保卡太过神圣，工作人员一看到就觉得自己不配接触这种至高无上的物品，赶紧把你请出去以示尊重。\n','https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e22687a2-7b0e-41da-aef8-04decbd57f5c/original=true,quality=90/ComfyUI_temp_qqodt_00002_.jpeg',0,0,1,'2024-11-29 10:51:03.927','2024-11-29 17:52:58.580',1,2,0),(9,'他们都说我脑子里有水，那为什么医生还要给我输液呢？','1732902778599-tāmen-d64c','<p>或者是医生们在进行某种高深莫测的实验，试图验证 “水能治百病” 的古老传说？无论如何，我倒是希望这些液体能让我变得更聪明，毕竟，脑子里的水多了，说不定能激发出一些惊人的创意呢！</p><p><br></p><p>这些液体会不会对我的大脑有什么影响？哦，当然有影响啦！也许它们会让你的思维变得如泉水般清澈，灵感如流水般源源不断地涌现。或者，它们会让你突然拥有超凡的记忆力，记住那些你从来不在意的小细节，比如你上次吃的那块蛋糕究竟有多少层奶油。</p><p><br></p><p>不过，更有可能的是，这些液体会让你在医生面前变得更加乖巧听话，毕竟他们可是花了不少时间和精力才把这些神奇的液体调配出来的。谁知道呢，也许你会突然发现自己对某种特定的液体产生了无比深厚的感情，每次看到输液瓶都忍不住想要给它写首诗，表达你对它的无限敬意和感激之情。</p>','难道是因为他们觉得我脑子里的水还不够多，需要再补充一点，才能达到某种神秘的平衡状态？','uploads/1732890333631-001.jpeg',0,0,1,'2024-11-29 14:18:30.673','2024-11-29 17:52:58.600',1,1,0),(10,'每次生病都要吃多颗的药，为什么不直接把它做成一颗呢','1732902778615-měicì-5654','<p>药厂希望你能体验到一种“药物拼图”的乐趣，每种药都有独特的颜色和形状，吃药的过程就像在完成一幅色彩斑斓的拼图，充满了成就感和仪式感。毕竟，生活已经够单调乏味了，吃药的过程也需要一点乐趣和挑战，不是吗？</p><p><br></p><p>还有一种可能性，那就是药厂们希望通过让你吃多颗药来锻炼你的耐心和毅力，毕竟，现代人总是急于求成，缺乏耐心。通过吃药这个小小的挑战，他们希望你能学会在生活中慢慢来，享受每一个细节，哪怕是吞下那些苦涩的小药丸。</p>',NULL,'uploads/1732893357015-76992a2b-230b-4260-b4df-055bd97a7052.jpg',0,0,1,'2024-11-29 15:15:58.977','2024-11-29 17:52:58.617',1,4,0);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `steps` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cookingTime` int DEFAULT NULL,
  `servings` int DEFAULT NULL,
  `difficulty` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `authorId` int NOT NULL,
  `categoryId` int NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Recipe_slug_key` (`slug`),
  KEY `Recipe_authorId_fkey` (`authorId`),
  KEY `Recipe_categoryId_fkey` (`categoryId`),
  CONSTRAINT `Recipe_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Recipe_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe`
--

LOCK TABLES `recipe` WRITE;
/*!40000 ALTER TABLE `recipe` DISABLE KEYS */;
INSERT INTO `recipe` VALUES (1,'test','1732902778629-test','单独特。\ntest',1,1,'easy','uploads/1732865342993-1.jpg','2024-11-29 07:31:09.796','2024-11-29 17:52:58.630',1,3,NULL),(2,'Lorem Ipsum','1732902778642-lorem-ipsum','Etiam eget ante non diam pretium blandit et\n ut sem. Nunc ut tincidunt neque. Suspendis\nse mattis vel mauris a commodo. Sed molestie liber\no vitae tellus vehicula, a suscipit ex pellentesque. Cur\nabitur malesuada ultricies magna, imperdiet porttitor diam aliquet \nsit amet. In vestibulum nulla in cursus lacinia. Etiam\n iaculis pretium mauris, in aliquet libero pellentesque a\n. Nunc sed viverra ligula, non lobortis felis. Sed dolor di\nam, commodo eu porta quis, faucibus vel purus. Mauris jus\nto nulla, tincidunt sed facilisis nec, blandit nec lectus. Mauris sodales nulla eu augue semper luctus.',1,1,'easy','uploads/1732875218417-1.jpg','2024-11-29 10:15:49.971','2024-11-29 17:52:58.644',1,3,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at lobortis sapien, vitae hendrerit dolor. Nulla scelerisque sapien eu risus lacinia, sed scelerisque ipsum condimentum. Sed at diam consectetur, semper justo sed, ultricies ipsum. Mauris scelerisque sapien sit amet risus pretium auctor. Pellentesque ac porttitor urna, eget tempor justo. Cras id accumsan eros, nec vehicula orci. Duis feugiat blandit lacus, eget varius sapien facilisis sed. Donec at nulla et sapien euismod pellentesque. Curabitur blandit suscipit neque, sed ornare mi porta ut. Vestibulum quis arcu luctus, placerat justo sagittis, sollicitudin ex. Fusce fermentum tortor tincidunt nisl scelerisque dignissim. Nam nisi mi, consectetur blandit faucibus ac, mollis egestas odio.');
/*!40000 ALTER TABLE `recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_name_key` (`name`),
  UNIQUE KEY `Tag_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES ('cm42dqg3r00004qy7usez0nmj','编程','programming','2024-11-29 06:45:40.744'),('cm42dqg4400014qy7ouk03ddq','美食','food','2024-11-29 06:45:40.756'),('cm42mc9740000bfiznr5nj4vg','news','news','2024-11-29 10:46:35.152'),('cm42vf0qy000011rfesbw97i2','弱智','弱智','2024-11-29 15:00:40.714');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'davidwang','$2a$10$PLz3Pu0eqvdA/ifFgzWhaef.6F8QnXA3LGtse2V6K1DDWugOJcgpC','admin@example.com','David Wang','/user_cover01.png','2024-11-29 06:45:40.480','2024-11-29 17:11:08.979',1),(2,'john_doe','$2a$10$sUKKDoqMhNAu2.ayEPrQKewbURvxAVLTbLwJ1052.GUujIGtDbd2e','john@example.com','John Doe',NULL,'2024-11-29 06:45:40.724','2024-11-29 06:45:40.724',0),(3,'jane_smith','$2a$10$/hThMa1h4UdTvl3RTKq0U.48DQJrdan5dHIXUMbUpOjj5AMiBU8L6','jane@example.com','Jane Smith',NULL,'2024-11-29 06:45:40.732','2024-11-29 06:45:40.732',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `viewhistory`
--

DROP TABLE IF EXISTS `viewhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viewhistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postId` int NOT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userAgent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `viewedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `ViewHistory_postId_viewedAt_idx` (`postId`,`viewedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viewhistory`
--

LOCK TABLES `viewhistory` WRITE;
/*!40000 ALTER TABLE `viewhistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `viewhistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-30 15:16:23
