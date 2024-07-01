
<h1>Attendance Tracking Web App</h1>

<p>This web application provides a platform for tracking attendance in various contexts, including educational institutions, offices, and events. The application has two main sections: User and Admin.</p>

<h2>Sections Overview</h2>

<h3>User</h3>
<p>Users can be Students, Employees, or Invitees. The user section includes the following functionalities:</p>
<ul>
    <li><strong>Signup:</strong> Users sign up using OTP verification via their phone numbers. They will provide details such as full name, email ID, DOB, etc.</li>
    <li><strong>User Type Selection:</strong> After signup, users will specify whether they are a Student, Employee, or Invitee. Each type has a different flow:
        <ul>
            <li><strong>Student:</strong> Students join courses using codes provided by professors. They generate QR codes for attendance during class times, which are scanned by professors to mark attendance.</li>
            <li><strong>Employee:</strong> Employees join departments using codes provided by office managers. They generate QR codes for attendance within the first hour of office time, which are scanned by managers.</li>
            <li><strong>Invitee:</strong> Invitees follow a similar process as employees, tailored to event attendance.</li>
        </ul>
    </li>
</ul>

<h3>Admin</h3>
<p>Admins can be either Owners or Managers, with the following functionalities:</p>
<ul>
    <li><strong>Owner:</strong>
        <ul>
            <li>Owners sign up using OTP verification and provide institution details (name, address, official mail ID, website).</li>
            <li>Verification of the institution is done through official site verification or address/mail-id verification.</li>
            <li>Owners create Managers (Professors, Office Managers, Event Managers) and manage their credentials.</li>
        </ul>
    </li>
    <li><strong>Manager:</strong>
        <ul>
            <li>Managers log in using credentials provided by the Owner.</li>
            <li>Different types of Managers handle attendance tracking:
                <ul>
                    <li><strong>Professor:</strong> Manages classes and generates QR codes for students to scan for attendance.</li>
                    <li><strong>Office Manager:</strong> Manages departments and scans QR codes for employees' attendance.</li>
                    <li><strong>Event Manager:</strong> Manages events and scans QR codes for invitees' attendance.</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

<h2>How to Use</h2>
<ol>
    <li>On the front page, choose whether you are a User or Admin.</li>
    <li>Follow the appropriate signup/login process based on your selection.</li>
    <li>For Users:
        <ul>
            <li>Complete the OTP signup process.</li>
            <li>Provide personal details and select your user type (Student, Employee, Invitee).</li>
            <li>Join courses/departments/events using provided codes and generate QR codes for attendance as required.</li>
        </ul>
    </li>
    <li>For Admins:
        <ul>
            <li>Owners complete the OTP signup process and provide institution details.</li>
            <li>Owners create and manage Managers.</li>
            <li>Managers log in using provided credentials and manage attendance tracking for their respective domains.</li>
        </ul>
    </li>
</ol>

<h2>Future Extensions</h2>
<p>Currently, the primary focus is on the Student-College system. Future updates will extend the functionality to include Employee-Office and Invitee-Event systems.</p>

<h2>Contact</h2>
<p>For any queries or support, please contact us at praveenrajpurak@gmail.com </p>

</body>

