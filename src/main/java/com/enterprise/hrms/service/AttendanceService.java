package com.enterprise.hrms.service;

import com.enterprise.hrms.dto.AttendanceResponse;
import com.enterprise.hrms.entity.Attendance;
import com.enterprise.hrms.entity.Employee;
import com.enterprise.hrms.exception.BadRequestException;
import com.enterprise.hrms.exception.ResourceNotFoundException;
import com.enterprise.hrms.repository.AttendanceRepository;
import com.enterprise.hrms.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    private static final LocalTime EXPECTED_START_TIME = LocalTime.of(9, 0); // 9:00 AM
    private static final double STANDARD_WORKING_HOURS = 8.0;

    public AttendanceResponse checkIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (attendanceRepository.findByEmployeeIdAndDate(employeeId, today).isPresent()) {
            throw new BadRequestException("Already checked in today");
        }

        boolean isLate = now.isAfter(EXPECTED_START_TIME);

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .date(today)
                .checkInTime(now)
                .isLate(isLate)
                .status(Attendance.AttendanceStatus.PRESENT)
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        return mapToResponse(saved);
    }

    public AttendanceResponse checkOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new BadRequestException("No check-in record found for today"));

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("Already checked out today");
        }

        attendance.setCheckOutTime(now);

        Duration duration = Duration.between(attendance.getCheckInTime(), now);
        double hoursWorked = duration.toMinutes() / 60.0;
        
        attendance.setWorkingHours(hoursWorked);

        if (hoursWorked > STANDARD_WORKING_HOURS) {
            attendance.setOvertimeHours(hoursWorked - STANDARD_WORKING_HOURS);
        } else {
            attendance.setOvertimeHours(0.0);
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToResponse(saved);
    }

    public List<AttendanceResponse> getAttendanceHistory(Long employeeId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .employeeId(attendance.getEmployee().getId())
                .employeeName(attendance.getEmployee().getFirstName() + " " + attendance.getEmployee().getLastName())
                .date(attendance.getDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .workingHours(attendance.getWorkingHours())
                .overtimeHours(attendance.getOvertimeHours())
                .isLate(attendance.getIsLate())
                .status(attendance.getStatus())
                .build();
    }
}
