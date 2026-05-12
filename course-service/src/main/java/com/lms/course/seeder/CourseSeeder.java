package com.lms.course.seeder;

import com.lms.course.entity.Course;
import com.lms.course.entity.Lesson;
import com.lms.course.enums.CourseStatus;
import com.lms.course.enums.DifficultyLevel;
import com.lms.course.enums.LessonType;
import com.lms.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CourseSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;

    @Override
    public void run(String... args) {
        if (courseRepository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        log.info("Seeding courses...");
        courseRepository.saveAll(getCourses());
        log.info("Seeding complete. {} courses inserted.", courseRepository.count());
    }

    private List<Course> getCourses() {
        return List.of(
                course("Understanding Einstein: The Special Theory of Relativity",
                        "Explore Einstein's special theory of relativity, time dilation, and spacetime in depth.",
                        "Science", DifficultyLevel.BEGINNER, 0.0, "Stanford University", "Larry Randles Lagerstrom", 4.9),

                course("JavaScript for Beginners Specialization",
                        "Learn JavaScript from scratch including jQuery, DOM manipulation, and async functions.",
                        "Programming", DifficultyLevel.BEGINNER, 0.0, "University of California Davis", "William Mead", 4.7),

                course("Security Compliance and Governance for AI Solutions",
                        "Understand governance, compliance, and security requirements for AI systems on AWS.",
                        "Cloud", DifficultyLevel.BEGINNER, 0.0, "Amazon Web Services", "AWS Instructor", 4.5),

                course("Python for Everybody Specialization",
                        "Learn Python programming fundamentals, data structures, and web scraping.",
                        "Programming", DifficultyLevel.BEGINNER, 0.0, "University of Michigan", "Charles Severance", 4.8),

                course("Machine Learning Specialization",
                        "Master machine learning concepts including supervised, unsupervised, and reinforcement learning.",
                        "Data Science", DifficultyLevel.INTERMEDIATE, 49.99, "Stanford University", "Andrew Ng", 4.9),

                course("Deep Learning Specialization",
                        "Build deep neural networks and apply them to computer vision and NLP tasks.",
                        "Data Science", DifficultyLevel.ADVANCED, 49.99, "DeepLearning.AI", "Andrew Ng", 4.9),

                course("The Science of Well-Being",
                        "Learn what psychological research says about happiness and how to apply it in your life.",
                        "Personal Development", DifficultyLevel.BEGINNER, 0.0, "Yale University", "Laurie Santos", 4.9),

                course("Google Data Analytics Certificate",
                        "Gain job-ready skills in data analytics including SQL, R, and Tableau.",
                        "Data Science", DifficultyLevel.BEGINNER, 39.99, "Google", "Google Instructor", 4.8),

                course("IBM Data Science Professional Certificate",
                        "Master data science tools including Python, SQL, and machine learning.",
                        "Data Science", DifficultyLevel.BEGINNER, 39.99, "IBM", "IBM Instructor", 4.6),

                course("Introduction to Public Speaking",
                        "Develop confidence and skills to deliver clear and engaging presentations.",
                        "Communication", DifficultyLevel.BEGINNER, 0.0, "University of Washington", "Matt McGarrity", 4.7),

                course("Financial Markets",
                        "Explore the theory and practice of financial markets, risk management, and behavioral finance.",
                        "Finance", DifficultyLevel.BEGINNER, 0.0, "Yale University", "Robert Shiller", 4.8),

                course("Introduction to Psychology",
                        "A broad overview of the science of psychology and its applications in everyday life.",
                        "Psychology", DifficultyLevel.BEGINNER, 0.0, "Yale University", "Paul Bloom", 4.7),

                course("Algorithmic Toolbox",
                        "Learn fundamental algorithms and data structures used in competitive programming.",
                        "Programming", DifficultyLevel.INTERMEDIATE, 49.99, "UC San Diego", "Neil Rhodes", 4.6),

                course("HTML CSS and Javascript for Web Developers",
                        "Build responsive websites using HTML5, CSS3, and JavaScript.",
                        "Web Development", DifficultyLevel.BEGINNER, 0.0, "Johns Hopkins University", "Yaakov Chaikin", 4.7),

                course("Introduction to Data Science in Python",
                        "Learn Python for data manipulation, analysis, and visualization using pandas.",
                        "Data Science", DifficultyLevel.INTERMEDIATE, 49.99, "University of Michigan", "Christopher Brooks", 4.5),

                course("Cloud Computing Specialization",
                        "Understand cloud architecture, distributed systems, and cloud-native applications.",
                        "Cloud", DifficultyLevel.ADVANCED, 49.99, "University of Illinois", "Indranil Gupta", 4.5),

                course("Agile Development and Scrum",
                        "Learn Agile methodology and Scrum framework for managing software projects.",
                        "Project Management", DifficultyLevel.BEGINNER, 0.0, "University of Virginia", "Alex Cowan", 4.6),

                course("Cryptocurrency and Blockchain",
                        "Understand how blockchain works and how cryptocurrencies are built on top of it.",
                        "Finance", DifficultyLevel.INTERMEDIATE, 49.99, "Princeton University", "Arvind Narayanan", 4.7),

                course("Cybersecurity Specialization",
                        "Learn how to protect systems and networks from digital attacks and vulnerabilities.",
                        "Security", DifficultyLevel.INTERMEDIATE, 49.99, "University of Maryland", "Jonathan Katz", 4.6),

                course("UX Design Professional Certificate",
                        "Design user-centered digital experiences using Figma and UX research methods.",
                        "Design", DifficultyLevel.BEGINNER, 39.99, "Google", "Google Instructor", 4.8),

                course("React Fundamentals",
                        "Learn the basics of React including components, hooks, and state management.",
                        "Web Development", DifficultyLevel.BEGINNER, 49.99, "Meta", "Meta Instructor", 4.8),

                course("Advanced React and Redux",
                        "Deep dive into React patterns, Redux state management, and performance optimization.",
                        "Web Development", DifficultyLevel.ADVANCED, 59.99, "Meta", "Meta Instructor", 4.7),

                course("Spring Boot Microservices",
                        "Build production-grade microservices with Spring Boot, Docker, and Kubernetes.",
                        "Programming", DifficultyLevel.ADVANCED, 59.99, "Amigoscode", "Nelson Djalo", 4.8),

                course("DevOps and Software Engineering",
                        "Learn CI/CD pipelines, Docker, Kubernetes, and cloud deployment strategies.",
                        "DevOps", DifficultyLevel.INTERMEDIATE, 49.99, "IBM", "IBM Instructor", 4.6),

                course("SQL for Data Science",
                        "Master SQL queries, joins, aggregations, and database design for data analysis.",
                        "Data Science", DifficultyLevel.BEGINNER, 0.0, "University of California Davis", "Sadie St. Lawrence", 4.6),

                course("Natural Language Processing Specialization",
                        "Build NLP models for sentiment analysis, machine translation, and chatbots.",
                        "Data Science", DifficultyLevel.ADVANCED, 59.99, "DeepLearning.AI", "Andrew Ng", 4.8),

                course("Computer Vision Basics",
                        "Introduction to image processing, feature extraction, and convolutional neural networks.",
                        "Data Science", DifficultyLevel.INTERMEDIATE, 49.99, "University at Buffalo", "Eli Saber", 4.5),

                course("iOS App Development with Swift",
                        "Build iOS applications using Swift and Xcode from scratch.",
                        "Mobile Development", DifficultyLevel.INTERMEDIATE, 49.99, "University of Toronto", "Parham Aarabi", 4.6),

                course("Android App Development",
                        "Learn to build Android apps using Kotlin and Android Studio.",
                        "Mobile Development", DifficultyLevel.INTERMEDIATE, 49.99, "Vanderbilt University", "Douglas Schmidt", 4.5),

                course("Docker and Kubernetes The Complete Guide",
                        "Master containerization with Docker and orchestration with Kubernetes.",
                        "DevOps", DifficultyLevel.INTERMEDIATE, 49.99, "Amigoscode", "Nelson Djalo", 4.8),

                course("Linear Algebra for Machine Learning",
                        "Understand vectors, matrices, and linear transformations as applied to ML.",
                        "Mathematics", DifficultyLevel.INTERMEDIATE, 0.0, "Imperial College London", "David Dye", 4.7),

                course("Statistics with Python Specialization",
                        "Learn statistical inference, hypothesis testing, and regression using Python.",
                        "Data Science", DifficultyLevel.INTERMEDIATE, 49.99, "University of Michigan", "Brenda Gunderson", 4.6),

                course("Blockchain Specialization",
                        "Design and build blockchain solutions using Ethereum and Solidity.",
                        "Programming", DifficultyLevel.ADVANCED, 59.99, "University at Buffalo", "Bina Ramamurthy", 4.5),

                course("Introduction to Philosophy",
                        "Explore core philosophical questions about knowledge, reality, and ethics.",
                        "Humanities", DifficultyLevel.BEGINNER, 0.0, "University of Edinburgh", "Dave Ward", 4.7),

                course("Learning How to Learn",
                        "Science-based techniques for mastering tough subjects more effectively.",
                        "Personal Development", DifficultyLevel.BEGINNER, 0.0, "UC San Diego", "Barbara Oakley", 4.8),

                course("Graphic Design Specialization",
                        "Learn typography, color theory, and layout design using Adobe tools.",
                        "Design", DifficultyLevel.BEGINNER, 39.99, "California Institute of the Arts", "Michael Worthington", 4.6),

                course("Photography Basics and Beyond",
                        "Master your camera, composition, and photo editing from beginner to advanced.",
                        "Arts", DifficultyLevel.BEGINNER, 0.0, "Michigan State University", "Peter Glendinning", 4.7),

                course("Supply Chain Management Specialization",
                        "Learn logistics, procurement, and supply chain optimization strategies.",
                        "Business", DifficultyLevel.INTERMEDIATE, 49.99, "Rutgers University", "Rudolf Leuschner", 4.6),

                course("Marketing Analytics",
                        "Use data to measure and optimize marketing campaigns and customer behavior.",
                        "Marketing", DifficultyLevel.INTERMEDIATE, 49.99, "University of Virginia", "Paul Farris", 4.6),

                course("Digital Marketing Specialization",
                        "Learn SEO, social media marketing, and content strategy for digital channels.",
                        "Marketing", DifficultyLevel.BEGINNER, 39.99, "University of Illinois", "Mike Yao", 4.5),

                course("Entrepreneurship Specialization",
                        "From idea to launch — learn how to build and fund a startup.",
                        "Business", DifficultyLevel.BEGINNER, 0.0, "University of Pennsylvania", "Ethan Mollick", 4.7),

                course("Leadership and Emotional Intelligence",
                        "Develop self-awareness, empathy, and leadership skills for the workplace.",
                        "Personal Development", DifficultyLevel.BEGINNER, 0.0, "Indian School of Business", "Prof. Anil Sachdev", 4.7),

                course("Introduction to Negotiation",
                        "Learn principled negotiation strategies used in business and everyday life.",
                        "Business", DifficultyLevel.BEGINNER, 0.0, "Yale University", "Barry Nalebuff", 4.8),

                course("Excel Skills for Business Specialization",
                        "Master Excel formulas, pivot tables, dashboards, and data visualization.",
                        "Business", DifficultyLevel.BEGINNER, 39.99, "Macquarie University", "Nicky Bull", 4.8),

                course("Accounting Fundamentals",
                        "Understand financial statements, bookkeeping, and basic accounting principles.",
                        "Finance", DifficultyLevel.BEGINNER, 0.0, "University of Illinois", "Gary Hecht", 4.6),

                course("Corporate Finance Essentials",
                        "Learn capital budgeting, valuation, and financial decision-making for firms.",
                        "Finance", DifficultyLevel.INTERMEDIATE, 49.99, "IESE Business School", "Jose Marin", 4.7),

                course("Introduction to Artificial Intelligence",
                        "Broad overview of AI concepts including search, planning, and machine learning.",
                        "Data Science", DifficultyLevel.BEGINNER, 0.0, "IBM", "IBM Instructor", 4.6),

                course("TensorFlow Developer Certificate",
                        "Build and train neural networks using TensorFlow for real-world applications.",
                        "Data Science", DifficultyLevel.INTERMEDIATE, 49.99, "DeepLearning.AI", "Laurence Moroney", 4.8),

                course("AWS Cloud Practitioner",
                        "Foundational knowledge of AWS services, pricing, and cloud concepts.",
                        "Cloud", DifficultyLevel.BEGINNER, 39.99, "Amazon Web Services", "AWS Instructor", 4.7),

                course("Google Cloud Professional Data Engineer",
                        "Design and build data processing systems on Google Cloud Platform.",
                        "Cloud", DifficultyLevel.ADVANCED, 59.99, "Google", "Google Instructor", 4.7),

                course("Robotics Specialization",
                        "Learn aerial robotics, estimation, mobility, and perception for autonomous systems.",
                        "Engineering", DifficultyLevel.ADVANCED, 59.99, "University of Pennsylvania", "Vijay Kumar", 4.6),

                course("Bioinformatics Specialization",
                        "Apply algorithms and programming to solve biological data problems.",
                        "Science", DifficultyLevel.ADVANCED, 59.99, "UC San Diego", "Pavel Pevzner", 4.7),

                course("Game Design and Development",
                        "Create games from scratch using Unity and learn core game design principles.",
                        "Design", DifficultyLevel.INTERMEDIATE, 49.99, "Michigan State University", "Brian Winn", 4.6),

                course("Music Production Specialization",
                        "Learn music theory, mixing, and production using digital audio workstations.",
                        "Arts", DifficultyLevel.BEGINNER, 39.99, "Berklee Online", "Loudon Stearns", 4.7),

                course("Positive Psychology",
                        "Learn the science of happiness, strengths, and human flourishing.",
                        "Psychology", DifficultyLevel.BEGINNER, 0.0, "University of North Carolina", "Barbara Fredrickson", 4.7),

                course("Introduction to Sociology",
                        "Explore how social forces shape individual behavior and group dynamics.",
                        "Humanities", DifficultyLevel.BEGINNER, 0.0, "Princeton University", "Mitchell Duneier", 4.6),

                course("Epidemiology in Public Health",
                        "Understand how diseases spread and how public health interventions work.",
                        "Health", DifficultyLevel.BEGINNER, 0.0, "Johns Hopkins University", "Moyses Szklo", 4.7),

                course("Healthcare Organization and Finance",
                        "Learn how healthcare systems are structured and financed globally.",
                        "Health", DifficultyLevel.INTERMEDIATE, 49.99, "Johns Hopkins University", "Gerard Anderson", 4.6),

                course("Introduction to Algorithms",
                        "Study sorting, searching, graph, and dynamic programming algorithms.",
                        "Programming", DifficultyLevel.INTERMEDIATE, 49.99, "MIT OpenCourseWare", "Erik Demaine", 4.8),

                course("Operating Systems and You",
                        "Learn how operating systems manage hardware, processes, and file systems.",
                        "Programming", DifficultyLevel.BEGINNER, 0.0, "Google", "Google Instructor", 4.6),

                course("Computer Networks",
                        "Understand TCP/IP, routing, DNS, HTTP, and how the internet works.",
                        "Engineering", DifficultyLevel.INTERMEDIATE, 49.99, "University of Washington", "David Wetherall", 4.6),

                course("Ethics in AI",
                        "Examine fairness, accountability, and transparency in AI systems.",
                        "Humanities", DifficultyLevel.BEGINNER, 0.0, "University of Helsinki", "Teemu Roos", 4.7),

                course("Quantum Computing",
                        "Introduction to quantum bits, gates, and algorithms for quantum computers.",
                        "Science", DifficultyLevel.ADVANCED, 59.99, "MIT", "Peter Shor", 4.7),

                course("Environmental Science and Sustainability",
                        "Study ecosystems, climate change, and sustainable development strategies.",
                        "Science", DifficultyLevel.BEGINNER, 0.0, "American Museum of Natural History", "Mark Norell", 4.6),

                course("Introduction to Game Theory",
                        "Learn strategic thinking, Nash equilibria, and decision-making models.",
                        "Mathematics", DifficultyLevel.INTERMEDIATE, 0.0, "Stanford University", "Matthew O. Jackson", 4.7),

                course("Calculus for Machine Learning",
                        "Understand derivatives, gradients, and optimization as used in ML models.",
                        "Mathematics", DifficultyLevel.INTERMEDIATE, 0.0, "Imperial College London", "Samuel Cooper", 4.7),

                course("Writing in the Sciences",
                        "Learn clear and concise scientific writing for research papers and reports.",
                        "Communication", DifficultyLevel.BEGINNER, 0.0, "Stanford University", "Kristin Sainani", 4.8),

                course("Academic English Writing Specialization",
                        "Improve your academic writing skills for university and research contexts.",
                        "Communication", DifficultyLevel.BEGINNER, 0.0, "UC Irvine", "Helen Nam", 4.6),

                course("Introduction to User Experience Design",
                        "Learn UX principles, wireframing, and usability testing fundamentals.",
                        "Design", DifficultyLevel.BEGINNER, 0.0, "Georgia Institute of Technology", "Rosa Arriaga", 4.6),

                course("Full Stack Web Development Specialization",
                        "Build complete web applications using React, Node.js, and MongoDB.",
                        "Web Development", DifficultyLevel.ADVANCED, 59.99, "Hong Kong University of Science", "Jogesh Muppala", 4.6),

                course("Data Structures and Algorithms Specialization",
                        "Master arrays, trees, graphs, and algorithm design techniques.",
                        "Programming", DifficultyLevel.ADVANCED, 59.99, "UC San Diego", "Michael Levin", 4.7),

                course("Introduction to Git and GitHub",
                        "Learn version control with Git and collaborate on projects using GitHub.",
                        "Programming", DifficultyLevel.BEGINNER, 0.0, "Google", "Google Instructor", 4.7),

                course("Probability and Statistics",
                        "Study probability theory, random variables, and statistical inference.",
                        "Mathematics", DifficultyLevel.INTERMEDIATE, 0.0, "Duke University", "Mine Cetinkaya-Rundel", 4.7),

                course("Social Psychology",
                        "Explore how social influence, conformity, and group dynamics shape behavior.",
                        "Psychology", DifficultyLevel.BEGINNER, 0.0, "Wesleyan University", "Scott Plous", 4.8),

                course("Introduction to Finance and Accounting",
                        "Learn financial statements, time value of money, and basic accounting.",
                        "Finance", DifficultyLevel.BEGINNER, 0.0, "University of Pennsylvania", "Michael Roberts", 4.7),

                course("Anatomy Specialization",
                        "Study human anatomy including musculoskeletal, cardiovascular, and nervous systems.",
                        "Health", DifficultyLevel.INTERMEDIATE, 49.99, "University of Michigan", "Glenn Fox", 4.8),

                course("Introduction to Classical Music",
                        "Survey Western classical music from the Baroque era to the modern period.",
                        "Arts", DifficultyLevel.BEGINNER, 0.0, "Yale University", "Craig Wright", 4.9),

                course("Supply Chain Logistics",
                        "Learn transportation, warehousing, and inventory management in supply chains.",
                        "Business", DifficultyLevel.BEGINNER, 0.0, "Rutgers University", "Rudolf Leuschner", 4.5),

                course("Python and Statistics for Financial Analysis",
                        "Use Python and statistics to analyze financial data and build trading strategies.",
                        "Finance", DifficultyLevel.INTERMEDIATE, 49.99, "Hong Kong University of Science", "Xuhu Wan", 4.5),

                course("Introduction to Cyber Attacks",
                        "Understand common cyber threats, vulnerabilities, and basic defense mechanisms.",
                        "Security", DifficultyLevel.BEGINNER, 0.0, "New York University", "Edward Amoroso", 4.6),

                course("Everyday Excel Specialization",
                        "Learn Excel for everyday tasks including formulas, charts, and automation.",
                        "Business", DifficultyLevel.BEGINNER, 39.99, "University of Colorado Boulder", "Charlie Nuttelman", 4.8),

                course("Brand Management",
                        "Learn how to build, position, and manage brands in competitive markets.",
                        "Marketing", DifficultyLevel.INTERMEDIATE, 49.99, "IE Business School", "Ignacio Gafo", 4.6),

                course("Introduction to Internet of Things",
                        "Explore IoT architecture, sensors, and connected device programming.",
                        "Engineering", DifficultyLevel.BEGINNER, 0.0, "UC San Diego", "Diba Mirza", 4.5),

                course("Astrobiology and the Search for Extraterrestrial Life",
                        "Examine the science of life in the universe and the search for it beyond Earth.",
                        "Science", DifficultyLevel.BEGINNER, 0.0, "University of Edinburgh", "Charles Cockell", 4.8),

                course("Introduction to Corporate Finance",
                        "Understand investment decisions, capital structure, and dividend policy.",
                        "Finance", DifficultyLevel.BEGINNER, 0.0, "Columbia University", "Laurence Booth", 4.6),

                course("Mindfulness and Well-Being Specialization",
                        "Practice mindfulness techniques to reduce stress and improve mental health.",
                        "Health", DifficultyLevel.BEGINNER, 0.0, "Rice University", "Denise Marigold", 4.7),

                course("Data Visualization with Tableau",
                        "Create interactive dashboards and visualizations using Tableau.",
                        "Data Science", DifficultyLevel.BEGINNER, 39.99, "UC Davis", "Govind Acharya", 4.6),

                course("Introduction to Thermodynamics",
                        "Learn energy, entropy, and thermodynamic cycles for engineering applications.",
                        "Engineering", DifficultyLevel.INTERMEDIATE, 0.0, "University of Michigan", "Margaret Wooldridge", 4.7),

                course("Strategic Management and Innovation",
                        "Understand competitive strategy, innovation management, and business models.",
                        "Business", DifficultyLevel.INTERMEDIATE, 49.99, "Copenhagen Business School", "Nicolai Foss", 4.6),

                course("Introduction to Psychology of Leadership",
                        "Study how leaders think, motivate teams, and drive organizational change.",
                        "Personal Development", DifficultyLevel.BEGINNER, 0.0, "Macquarie University", "Richard Bolden", 4.6),

                course("Web Accessibility",
                        "Learn how to build inclusive websites that work for users with disabilities.",
                        "Web Development", DifficultyLevel.BEGINNER, 0.0, "Google", "Google Instructor", 4.7),

                course("Kotlin for Java Developers",
                        "Transition from Java to Kotlin with hands-on exercises and real projects.",
                        "Programming", DifficultyLevel.INTERMEDIATE, 49.99, "JetBrains", "Svetlana Isakova", 4.8),

                course("Introduction to Typography",
                        "Explore the history, theory, and practice of typography in design.",
                        "Design", DifficultyLevel.BEGINNER, 0.0, "California Institute of the Arts", "Simon Johnston", 4.6),

                course("Business Analytics Specialization",
                        "Use data to drive decisions in marketing, operations, and finance.",
                        "Business", DifficultyLevel.INTERMEDIATE, 49.99, "University of Pennsylvania", "Eric Bradlow", 4.7),

                course("Microeconomics Principles",
                        "Study supply and demand, market equilibrium, and consumer behavior.",
                        "Economics", DifficultyLevel.BEGINNER, 0.0, "University of Illinois", "Jose Vazquez", 4.6),

                course("Macroeconomics for Business",
                        "Understand GDP, inflation, monetary policy, and their business implications.",
                        "Economics", DifficultyLevel.BEGINNER, 0.0, "IE Business School", "Kal Dohan", 4.5),

                course("Computational Neuroscience",
                        "Model brain function using mathematical and computational techniques.",
                        "Science", DifficultyLevel.ADVANCED, 59.99, "University of Washington", "Adrienne Fairhall", 4.7),

                course("Introduction to Philosophy of Mind",
                        "Examine consciousness, perception, and the nature of mental states.",
                        "Humanities", DifficultyLevel.BEGINNER, 0.0, "University of Edinburgh", "Andy Clark", 4.7)
        );
    }

    private Course course(String title, String description, String category,
                          DifficultyLevel level, Double price,
                          String org, String instructorName, Double rating) {
        Course course = Course.builder()
                .title(title)
                .description(description)
                .category(category)
                .difficultyLevel(level)
                .price(price)
                .instructorName(instructorName)
                .instructorId(1L)
                .rating(rating)
                .enrolledCount(0)
                .featured(false)
                .status(CourseStatus.PUBLISHED)
                .thumbnailUrl(null)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        course.setLessons(createLessons(course));
        return course;
    }

    private List<Lesson> createLessons(Course course) {
        return List.of(
                lesson("Introduction", LessonType.VIDEO,
                        "https://example.com/videos/intro", 12, 1, course),
                lesson("Core Concepts", LessonType.VIDEO,
                        "https://example.com/videos/core", 18, 2, course),
                lesson("Reading Material", LessonType.TEXT,
                        "https://example.com/text/notes", 8, 3, course),
                lesson("Knowledge Check", LessonType.QUIZ,
                        "https://example.com/quizzes/quiz", 5, 4, course),
                lesson("Hands-on Project", LessonType.VIDEO,
                        "https://example.com/videos/project", 22, 5, course)
        );
    }

    private Lesson lesson(String title, LessonType type, String contentUrl,
                          Integer duration, Integer position, Course course) {
        return Lesson.builder()
                .title(title)
                .type(type)
                .contentUrl(contentUrl)
                .duration(duration)
                .position(position)
                .course(course)
                .build();
    }
}