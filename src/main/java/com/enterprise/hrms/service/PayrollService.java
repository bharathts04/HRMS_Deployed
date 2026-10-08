package com.enterprise.hrms.service;

import com.enterprise.hrms.dto.PayrollRequest;
import com.enterprise.hrms.dto.PayrollResponse;
import com.enterprise.hrms.entity.Employee;
import com.enterprise.hrms.entity.Salary;
import com.enterprise.hrms.exception.BadRequestException;
import com.enterprise.hrms.exception.ResourceNotFoundException;
import com.enterprise.hrms.repository.EmployeeRepository;
import com.enterprise.hrms.repository.SalaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final SalaryRepository salaryRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollResponse generatePayroll(PayrollRequest request) {
        if (salaryRepository.findByEmployeeIdAndMonthAndYear(request.getEmployeeId(), request.getMonth(), request.getYear()).isPresent()) {
            throw new BadRequestException("Payroll already generated for this month and year.");
        }

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        // Defaults from Employee salary if not overridden
        double basic = request.getBasic() != null ? request.getBasic() : (employee.getSalary() != null ? employee.getSalary() * 0.4 : 0);
        double hra = basic * 0.5; // 50% of basic
        double bonus = request.getBonus() != null ? request.getBonus() : 0;
        double allowance = request.getAllowance() != null ? request.getAllowance() : 0;
        
        double grossSalary = basic + hra + bonus + allowance;
        
        // Simple Tax and PF logic
        double tax = grossSalary * 0.1; // 10% flat tax for example
        double pf = basic * 0.12; // 12% of basic
        
        double netSalary = grossSalary - tax - pf;

        Salary salary = Salary.builder()
                .employee(employee)
                .month(request.getMonth())
                .year(request.getYear())
                .paymentDate(request.getPaymentDate())
                .basic(basic)
                .hra(hra)
                .bonus(bonus)
                .allowance(allowance)
                .tax(tax)
                .pf(pf)
                .netSalary(netSalary)
                .build();

        Salary saved = salaryRepository.save(salary);
        return mapToResponse(saved);
    }

    public Page<PayrollResponse> getPayrollHistory(Long employeeId, Pageable pageable) {
        return salaryRepository.findByEmployeeId(employeeId, pageable)
                .map(this::mapToResponse);
    }

    public Page<PayrollResponse> getAllPayrolls(Pageable pageable) {
        return salaryRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private PayrollResponse mapToResponse(Salary salary) {
        return PayrollResponse.builder()
                .id(salary.getId())
                .employeeId(salary.getEmployee().getId())
                .employeeName(salary.getEmployee().getFirstName() + " " + salary.getEmployee().getLastName())
                .month(salary.getMonth())
                .year(salary.getYear())
                .paymentDate(salary.getPaymentDate())
                .basic(salary.getBasic())
                .hra(salary.getHra())
                .bonus(salary.getBonus())
                .allowance(salary.getAllowance())
                .tax(salary.getTax())
                .pf(salary.getPf())
                .netSalary(salary.getNetSalary())
                .build();
    }
}
