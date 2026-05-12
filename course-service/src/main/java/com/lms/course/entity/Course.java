package com.lms.course.entity;

import com.lms.course.enums.CourseStatus;
import com.lms.course.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;

    private String title;
    private String description;
    private Double price;
    private String category;
    private String thumbnailUrl;

    private Double rating = 0.0;
    private Integer enrolledCount = 0;
    private String instructorName;
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @Enumerated(EnumType.STRING)
    private CourseStatus status;

    private Long instructorId;

    private Boolean featured = false;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Lesson> lessons;
}