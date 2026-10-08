package com.enterprise.hrms.config;

import com.enterprise.hrms.entity.*;
import com.enterprise.hrms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PerformanceReviewRepository performanceReviewRepository;
    private final SalaryRepository salaryRepository;
    private final JobPositionRepository jobPositionRepository;
    private final AnnouncementRepository announcementRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Only run data seeder if the database is completely empty (0 users).
        // Since your database is now populated, this will skip immediately on startup!
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("=========================================");
        System.out.println("EMPTY DATABASE DETECTED. INJECTING ENTERPRISE HRMS DATA...");
        
        // 1. Ensure Admin Account Exists
        User adminUser = new User();
        adminUser.setEmail("admin@hrms.com");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setRole(Role.ROLE_ADMIN);
        userRepository.save(adminUser);

        // 2. Ensure Core Departments Exist
        Department hrDept = getOrCreateDepartment("Human Resources", "Core HR & Employee Engagement");
        Department engDept = getOrCreateDepartment("Engineering", "Software Development & Systems Architecture");
        Department itDept = getOrCreateDepartment("Information Technology", "IT Support, Cloud Infrastructure & DevOps");
        Department finDept = getOrCreateDepartment("Finance & Accounts", "Financial Planning, Payroll & Corporate Audits");
        Department mktgDept = getOrCreateDepartment("Marketing", "Brand Strategy, Digital Marketing & Growth");
        Department salesDept = getOrCreateDepartment("Sales & Outreach", "Client Relations & Global Business Development");
        Department opsDept = getOrCreateDepartment("Operations", "Supply Chain, Logistics & Facilities Support");

        // Ensure Admin Employee Profile exists
        Employee adminEmployee = new Employee();
        adminEmployee.setFirstName("System");
        adminEmployee.setLastName("Administrator");
        adminEmployee.setPhone("+1-555-0100");
        adminEmployee.setAddress("100 Enterprise Parkway, Tech City, NY 10001");
        adminEmployee.setDesignation("Chief HR Executive & Admin");
        adminEmployee.setSalary(150000.0);
        adminEmployee.setJoiningDate(LocalDate.now().minusMonths(12));
        adminEmployee.setDateOfBirth(LocalDate.of(1983, 5, 14));
        adminEmployee.setUser(adminUser);
        adminEmployee.setDepartment(hrDept);
        employeeRepository.save(adminEmployee);

        // 3. Inject Rich Enterprise Employees
        System.out.println("Seeding realistic enterprise staff workforce...");
        seedEmployee("sarah.jenkins@hrms.com", "Sarah", "Jenkins", "HR Manager", 85000.0, hrDept, 5, Role.ROLE_HR, 1988, 3, 12, "+1-555-0101");
        seedEmployee("alex.morgan@hrms.com", "Alex", "Morgan", "Senior HR Specialist", 68000.0, hrDept, 4, Role.ROLE_EMPLOYEE, 1992, 7, 21, "+1-555-0102");
        seedEmployee("michael.chang@hrms.com", "Michael", "Chang", "Lead Software Engineer", 125000.0, engDept, 6, Role.ROLE_EMPLOYEE, 1989, 11, 4, "+1-555-0103");
        seedEmployee("emily.rodriguez@hrms.com", "Emily", "Rodriguez", "Full Stack Developer", 95000.0, engDept, 4, Role.ROLE_EMPLOYEE, 1994, 2, 18, "+1-555-0104");
        seedEmployee("david.kim@hrms.com", "David", "Kim", "Backend Java Developer", 92000.0, engDept, 3, Role.ROLE_EMPLOYEE, 1991, 9, 29, "+1-555-0105");
        seedEmployee("priya.patel@hrms.com", "Priya", "Patel", "Frontend React Developer", 90000.0, engDept, 2, Role.ROLE_EMPLOYEE, 1995, 1, 15, "+1-555-0106");
        seedEmployee("robert.taylor@hrms.com", "Robert", "Taylor", "DevOps Architect", 115000.0, itDept, 5, Role.ROLE_EMPLOYEE, 1987, 6, 8, "+1-555-0107");
        seedEmployee("jessica.williams@hrms.com", "Jessica", "Williams", "Systems Administrator", 78000.0, itDept, 3, Role.ROLE_EMPLOYEE, 1993, 4, 23, "+1-555-0108");
        seedEmployee("daniel.martinez@hrms.com", "Daniel", "Martinez", "Cloud Security Analyst", 88000.0, itDept, 1, Role.ROLE_EMPLOYEE, 1990, 8, 11, "+1-555-0109");
        seedEmployee("laura.thompson@hrms.com", "Laura", "Thompson", "Finance Director", 130000.0, finDept, 6, Role.ROLE_EMPLOYEE, 1985, 12, 5, "+1-555-0110");
        seedEmployee("james.wilson@hrms.com", "James", "Wilson", "Senior Payroll Officer", 75000.0, finDept, 4, Role.ROLE_EMPLOYEE, 1991, 10, 19, "+1-555-0111");
        seedEmployee("sophia.andersson@hrms.com", "Sophia", "Andersson", "Accountant & Tax Lead", 72000.0, finDept, 2, Role.ROLE_EMPLOYEE, 1996, 5, 27, "+1-555-0112");
        seedEmployee("mark.johnson@hrms.com", "Mark", "Johnson", "VP of Marketing", 135000.0, mktgDept, 5, Role.ROLE_EMPLOYEE, 1984, 9, 14, "+1-555-0113");
        seedEmployee("chloe.davis@hrms.com", "Chloe", "Davis", "Digital Marketing Specialist", 65000.0, mktgDept, 2, Role.ROLE_EMPLOYEE, 1997, 3, 22, "+1-555-0114");
        seedEmployee("brian.miller@hrms.com", "Brian", "Miller", "Content Brand Lead", 68000.0, mktgDept, 1, Role.ROLE_EMPLOYEE, 1993, 7, 3, "+1-555-0115");
        seedEmployee("kevin.brown@hrms.com", "Kevin", "Brown", "Director of Sales", 140000.0, salesDept, 6, Role.ROLE_EMPLOYEE, 1986, 11, 30, "+1-555-0116");
        seedEmployee("rachel.garcia@hrms.com", "Rachel", "Garcia", "Account Executive", 80000.0, salesDept, 3, Role.ROLE_EMPLOYEE, 1992, 2, 9, "+1-555-0117");
        seedEmployee("steven.harris@hrms.com", "Steven", "Harris", "Sales Representative", 62000.0, salesDept, 0, Role.ROLE_EMPLOYEE, 1995, 8, 17, "+1-555-0118");
        seedEmployee("olivia.martin@hrms.com", "Olivia", "Martin", "Operations Lead", 85000.0, opsDept, 4, Role.ROLE_EMPLOYEE, 1990, 4, 13, "+1-555-0119");
        seedEmployee("nathan.clak@hrms.com", "Nathan", "Clark", "Facilities Specialist", 58000.0, opsDept, 0, Role.ROLE_EMPLOYEE, 1998, 6, 25, "+1-555-0120");

        List<Employee> allEmployees = employeeRepository.findAll();
        Employee reviewerAdmin = allEmployees.stream().filter(e -> e.getUser() != null && e.getUser().getRole() == Role.ROLE_ADMIN).findFirst().orElse(allEmployees.get(0));

        // 4. Seed Job Positions
        if (jobPositionRepository.count() == 0) {
            System.out.println("Seeding active Job Positions...");
            jobPositionRepository.save(JobPosition.builder().title("Senior Full-Stack Engineer").department(engDept).description("Expert in Java Spring Boot & React microservices.").employmentType("Full-Time").location("Hybrid - New York").status(JobPosition.PositionStatus.OPEN).postedDate(LocalDate.now().minusDays(14)).build());
            jobPositionRepository.save(JobPosition.builder().title("DevOps & Cloud Administrator").department(itDept).description("Experience with Kubernetes, AWS, and CI/CD pipelines.").employmentType("Full-Time").location("Remote").status(JobPosition.PositionStatus.OPEN).postedDate(LocalDate.now().minusDays(10)).build());
            jobPositionRepository.save(JobPosition.builder().title("HR Operations Executive").department(hrDept).description("Oversee employee onboarding, compliance, and relations.").employmentType("Full-Time").location("On-Site - New York").status(JobPosition.PositionStatus.OPEN).postedDate(LocalDate.now().minusDays(5)).build());
            jobPositionRepository.save(JobPosition.builder().title("Regional Sales Manager").department(salesDept).description("Drive enterprise account acquisition and pipeline expansion.").employmentType("Full-Time").location("Hybrid - Chicago").status(JobPosition.PositionStatus.OPEN).postedDate(LocalDate.now().minusDays(7)).build());
            jobPositionRepository.save(JobPosition.builder().title("Senior Corporate Counsel").department(hrDept).description("Legal guidance on employment law and contracts.").employmentType("Contract").location("Remote").status(JobPosition.PositionStatus.ON_HOLD).postedDate(LocalDate.now().minusDays(25)).build());
        }

        // 5. Seed Announcements
        if (announcementRepository.count() == 0) {
            System.out.println("Seeding workplace Announcements...");
            announcementRepository.save(Announcement.builder().title("Annual Enterprise Hackathon & Tech Expo 2026").content("We are thrilled to announce our global innovation hackathon next month! Assemble cross-departmental teams and present revolutionary prototypes.").type(Announcement.AnnouncementType.EVENT).isPinned(true).expiresAt(LocalDateTime.now().plusDays(30)).build());
            announcementRepository.save(Announcement.builder().title("Updated Hybrid Work Policy & Flexible Hours").content("As part of our dedication to work-life harmony, core collaborative hours are now officially 10:00 AM to 4:00 PM local time across all regional offices.").type(Announcement.AnnouncementType.POLICY).isPinned(true).expiresAt(LocalDateTime.now().plusDays(60)).build());
            announcementRepository.save(Announcement.builder().title("Upcoming Public Holiday Notice").content("Please note that all corporate headquarters and regional hub offices will be closed this Friday in observance of the upcoming national holiday.").type(Announcement.AnnouncementType.HOLIDAY).isPinned(false).expiresAt(LocalDateTime.now().plusDays(14)).build());
        }

        // 6. Seed Leave Requests
        if (leaveRequestRepository.count() < 8 && allEmployees.size() > 5) {
            System.out.println("Seeding realistic Leave Requests across staff...");
            for (int i = 1; i < Math.min(10, allEmployees.size()); i++) {
                Employee emp = allEmployees.get(i);
                if (leaveRequestRepository.findAll().stream().noneMatch(l -> l.getEmployee() != null && l.getEmployee().getId().equals(emp.getId()))) {
                    LeaveRequest.LeaveStatus status = (i % 3 == 0) ? LeaveRequest.LeaveStatus.PENDING : (i % 5 == 0) ? LeaveRequest.LeaveStatus.REJECTED : LeaveRequest.LeaveStatus.APPROVED;
                    LeaveRequest.LeaveType type = (i % 2 == 0) ? LeaveRequest.LeaveType.PAID : LeaveRequest.LeaveType.SICK;
                    leaveRequestRepository.save(LeaveRequest.builder()
                            .employee(emp)
                            .type(type)
                            .startDate(LocalDate.now().plusDays((i * 2) - 5))
                            .endDate(LocalDate.now().plusDays((i * 2)))
                            .reason(type == LeaveRequest.LeaveType.PAID ? "Annual family vacation & personal leave" : "Medical checkup & prescribed rest")
                            .status(status)
                            .approvedBy(status != LeaveRequest.LeaveStatus.PENDING ? reviewerAdmin : null)
                            .build());
                }
            }
        }

        // 7. Seed Performance Reviews
        System.out.println("Verifying & seeding Performance Reviews for all employees...");
        String[] commentsList = {
            "Consistently exceeds quarterly KPI targets and demonstrates outstanding cross-departmental collaboration.",
            "Delivered exemplary results on recent technical milestones. Exceptional analytical foresight and dependability.",
            "Highly collaborative professional with strong communicative proficiency and innovative problem-solving abilities.",
            "Pivotal contributor to strategic team initiatives. Proactively guides and mentors team members effectively.",
            "Maintains pristine operational quality and compliance across all assigned deliverables. A valued team asset.",
            "Exhibited notable resilience under tight project constraints, optimizing operational productivity by over 25%."
        };
        
        for (int i = 0; i < allEmployees.size(); i++) {
            Employee emp = allEmployees.get(i);
            if (emp.getId().equals(reviewerAdmin.getId())) continue;

            boolean hasReview = performanceReviewRepository.findAll().stream()
                    .anyMatch(pr -> pr.getEmployee() != null && pr.getEmployee().getId().equals(emp.getId()));

            if (!hasReview) {
                double comm = 4.2 + ((i % 8) * 0.1);
                double prod = 4.3 + ((i % 7) * 0.1);
                double team = 4.4 + ((i % 6) * 0.1);
                double lead = 4.0 + ((i % 9) * 0.1);
                double overall = Math.round(((comm + prod + team + lead) / 4.0) * 10.0) / 10.0;
                String comments = commentsList[i % commentsList.length];

                performanceReviewRepository.save(PerformanceReview.builder()
                        .employee(emp)
                        .reviewer(reviewerAdmin)
                        .reviewDate(LocalDate.now().minusDays(5 + (i * 4) % 60))
                        .communicationScore(Math.min(5.0, Math.round(comm * 10.0) / 10.0))
                        .productivityScore(Math.min(5.0, Math.round(prod * 10.0) / 10.0))
                        .teamworkScore(Math.min(5.0, Math.round(team * 10.0) / 10.0))
                        .leadershipScore(Math.min(5.0, Math.round(lead * 10.0) / 10.0))
                        .overallRating(Math.min(5.0, overall))
                        .comments(comments)
                        .build());
            }
        }

        // 8. Seed 3 months of Payroll Slips
        System.out.println("Verifying & seeding 3 months of Payroll Slips for all employees...");
        for (Employee emp : allEmployees) {
            for (int m = 0; m < 3; m++) {
                LocalDate targetMonthDate = LocalDate.now().minusMonths(m);
                String monthStr = targetMonthDate.getMonth().name().substring(0, 3);
                String yearStr = String.valueOf(targetMonthDate.getYear());
                
                boolean slipExists = salaryRepository.findAll().stream().anyMatch(s -> 
                    s.getEmployee() != null && s.getEmployee().getId().equals(emp.getId()) &&
                    s.getMonth() != null && (s.getMonth().equalsIgnoreCase(monthStr) || s.getMonth().equalsIgnoreCase(targetMonthDate.getMonth().name())) &&
                    s.getYear() != null && s.getYear().equals(yearStr)
                );
                
                if (!slipExists) {
                    Double base = emp.getSalary() != null ? emp.getSalary() : 75000.0;
                    Double monthlyBasic = Math.round((base * 0.5 / 12) * 100.0) / 100.0;
                    Double hra = Math.round((monthlyBasic * 0.4) * 100.0) / 100.0;
                    Double allowance = Math.round((monthlyBasic * 0.25) * 100.0) / 100.0;
                    Double bonus = (m == 1) ? Math.round((monthlyBasic * 0.2) * 100.0) / 100.0 : Math.round((monthlyBasic * 0.1) * 100.0) / 100.0;
                    Double tax = Math.round((monthlyBasic * 0.15) * 100.0) / 100.0;
                    Double pf = Math.round((monthlyBasic * 0.12) * 100.0) / 100.0;
                    Double net = Math.round((monthlyBasic + hra + allowance + bonus - tax - pf) * 100.0) / 100.0;

                    salaryRepository.save(Salary.builder()
                            .employee(emp)
                            .basic(monthlyBasic)
                            .hra(hra)
                            .allowance(allowance)
                            .bonus(bonus)
                            .tax(tax)
                            .pf(pf)
                            .netSalary(net)
                            .paymentDate(targetMonthDate.withDayOfMonth(m == 0 ? Math.min(LocalDate.now().getDayOfMonth(), 25) : 25))
                            .month(monthStr)
                            .year(yearStr)
                            .build());
                }
            }
        }

        // 9. Seed 30-Day Attendance History
        if (attendanceRepository.count() < allEmployees.size() * 10) {
            System.out.println("Populating 30-day historical Attendance records...");
            LocalDate today = LocalDate.now();
            for (int i = 29; i >= 0; i--) {
                LocalDate targetDate = today.minusDays(i);
                if (targetDate.getDayOfWeek().getValue() > 5) continue;
                
                for (int empIdx = 0; empIdx < allEmployees.size(); empIdx++) {
                    Employee emp = allEmployees.get(empIdx);
                    if (attendanceRepository.findAll().stream().anyMatch(a -> a.getEmployee() != null && a.getEmployee().getId().equals(emp.getId()) && a.getDate() != null && a.getDate().equals(targetDate))) {
                        continue;
                    }

                    Attendance.AttendanceStatus status = Attendance.AttendanceStatus.PRESENT;
                    LocalTime checkIn = LocalTime.of(8, 50, (empIdx * 7) % 60);
                    LocalTime checkOut = LocalTime.of(17, 30, (empIdx * 13) % 60);
                    Double workHours = 8.5;
                    Boolean isLate = false;

                    if ((i + empIdx) % 11 == 0 && empIdx != 0) {
                        status = Attendance.AttendanceStatus.ABSENT;
                        checkIn = null;
                        checkOut = null;
                        workHours = 0.0;
                    } else if ((i + empIdx) % 7 == 3 && empIdx != 0 && i != 0) {
                        checkIn = LocalTime.of(9, 25);
                        workHours = 7.8;
                        isLate = true;
                    }

                    attendanceRepository.save(Attendance.builder()
                            .employee(emp)
                            .date(targetDate)
                            .checkInTime(checkIn)
                            .checkOutTime(checkOut)
                            .workingHours(workHours)
                            .overtimeHours(status == Attendance.AttendanceStatus.PRESENT ? 0.5 : 0.0)
                            .isLate(isLate)
                            .status(status)
                            .build());
                }
            }
        }

        System.out.println("=========================================");
        System.out.println("ENTERPRISE HRMS DATA INJECTION COMPLETE!");
        System.out.println("Admin login: admin@hrms.com | pass: admin123");
        System.out.println("Staff logins (all): *.hrms.com | pass: password123");
        System.out.println("=========================================");
    }

    private Department getOrCreateDepartment(String name, String description) {
        return departmentRepository.findAll().stream()
                .filter(d -> d.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    Department d = new Department();
                    d.setName(name);
                    d.setDescription(description);
                    return departmentRepository.save(d);
                });
    }

    private void seedEmployee(String email, String firstName, String lastName, String designation, Double salary, Department dept, int monthsAgo, Role role, int birthYear, int birthMonth, int birthDay, String phone) {
        if (!userRepository.existsByEmail(email)) {
            User u = new User();
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode("password123"));
            u.setRole(role);
            userRepository.save(u);

            Employee emp = new Employee();
            emp.setFirstName(firstName);
            emp.setLastName(lastName);
            emp.setPhone(phone);
            emp.setAddress("456 Innovation Blvd, Suite " + (100 + (monthsAgo * 10)) + ", New York, NY 10001");
            emp.setDesignation(designation);
            emp.setSalary(salary);
            emp.setJoiningDate(LocalDate.now().minusMonths(monthsAgo).minusDays((birthDay % 25) + 1));
            emp.setDateOfBirth(LocalDate.of(birthYear, birthMonth, birthDay));
            emp.setUser(u);
            emp.setDepartment(dept);
            employeeRepository.save(emp);
        }
    }
}
