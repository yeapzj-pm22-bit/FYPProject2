package org.example;

public class MYJDBC {

    public static void main(String args[]){
        try{
            Connection connection   = DriverManager.getConnection(
                    url : "jdbc:mysql://3306/fyp",
                    user: "root",
                    password: "1234",
        );
            Statement statement = connection.createStatements();
            Resultset resultset =statement.executeQuery("SELECT * FROM users");

            while(resultset){
                System.out.println(resultset].getString("userId");
            }
        }
        catch(java.sql.SQLException e) (
                e.printStackTrace();
        )
    }
}