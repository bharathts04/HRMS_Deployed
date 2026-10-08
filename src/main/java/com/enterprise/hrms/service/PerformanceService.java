package com.enterprise.hrms.service;

import com.enterprise.hrms.dto.PerformanceReviewRequest;
import com.enterprise.hrms.dto.PerformanceReviewResponse;
import com.enterprise.hrms.entity.Employee;
import com.enterprise.hrms.entity.PerformanceReview;
import com.enterprise.hrms.exception.ResourceNotFoundException;
import com.enterprise.hrms.repository.EmployeeRepository;
import com.enterprise.hrms.repository.PerformanceReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final PerformanceReviewRepository reviewRepository;
    private final EmployeeRepository employeeRepository;

    public PerformanceReviewResponse submitReview(PerformanceReviewRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Employee reviewer = employeeRepository.findById(request.getReviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));

        double overall = (request.getCommunicationScore() + 
                         request.getProductivityScore() + 
                         request.getTeamworkScore() + 
                         request.getLeadershipScore()) / 4.0;

        PerformanceReview review = PerformanceReview.builder()
                .employee(employee)
                .reviewer(reviewer)
                .reviewDate(LocalDate.now())
                .communicationScore(request.getCommunicationScore())
                .productivityScore(request.getProductivityScore())
                .teamworkScore(request.getTeamworkScore())
                .leadershipScore(request.getLeadershipScore())
                .overallRating(overall)
                .comments(request.getComments())
                .build();

        PerformanceReview saved = reviewRepository.save(review);
        return mapToResponse(saved);
    }

    public Page<PerformanceReviewResponse> getReviewsForEmployee(Long employeeId, Pageable pageable) {
        return reviewRepository.findByEmployeeId(employeeId, pageable)
                .map(this::mapToResponse);
    }

    public Page<PerformanceReviewResponse> getReviewsByReviewer(Long reviewerId, Pageable pageable) {
        return reviewRepository.findByReviewerId(reviewerId, pageable)
                .map(this::mapToResponse);
    }

    public Page<PerformanceReviewResponse> getAllReviews(Pageable pageable) {
        return reviewRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    private PerformanceReviewResponse mapToResponse(PerformanceReview review) {
        return PerformanceReviewResponse.builder()
                .id(review.getId())
                .employeeId(review.getEmployee().getId())
                .employeeName(review.getEmployee().getFirstName() + " " + review.getEmployee().getLastName())
                .reviewerId(review.getReviewer().getId())
                .reviewerName(review.getReviewer().getFirstName() + " " + review.getReviewer().getLastName())
                .reviewDate(review.getReviewDate())
                .communicationScore(review.getCommunicationScore())
                .productivityScore(review.getProductivityScore())
                .teamworkScore(review.getTeamworkScore())
                .leadershipScore(review.getLeadershipScore())
                .overallRating(review.getOverallRating())
                .comments(review.getComments())
                .build();
    }
}
