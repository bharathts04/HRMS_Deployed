import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckDb {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/hrms_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "root123";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {

            System.out.println("--- USERS ---");
            ResultSet rs = stmt.executeQuery("SELECT id, email, password FROM users");
            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + ", Email: " + rs.getString("email") + ", Password: " + rs.getString("password"));
            }

            System.out.println("\n--- EMPLOYEES ---");
            ResultSet rs2 = stmt.executeQuery("SELECT id, user_id, first_name, last_name FROM employees");
            while (rs2.next()) {
                System.out.println("ID: " + rs2.getInt("id") + ", UserID: " + rs2.getInt("user_id") + ", Name: " + rs2.getString("first_name") + " " + rs2.getString("last_name"));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
