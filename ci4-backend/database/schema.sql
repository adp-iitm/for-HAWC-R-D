
-- Auth Users Table
CREATE TABLE IF NOT EXISTS auth_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Teachers Table (1-to-1 relationship with auth_user)
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    university_name VARCHAR(100) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    year_joined INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_university (university_name),
    INDEX idx_year_joined (year_joined)
);

-- Sample data for testing (Indianized)
-- Password for all users below is: password
INSERT INTO auth_user (email, first_name, last_name, password) VALUES
('arjun.iyer@iisc.ac.in', 'Arjun', 'Iyer', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('priya.sharma@du.ac.in', 'Priya', 'Sharma', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('rahul.verma@annauniv.edu', 'Rahul', 'Verma', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('ananya.rao@iitb.ac.in', 'Ananya', 'Rao', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('sachin.kulkarni@sppu.ac.in', 'Sachin', 'Kulkarni', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('meera.nair@uohyd.ac.in', 'Meera', 'Nair', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('vikram.singh@bhu.ac.in', 'Vikram', 'Singh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('neha.patel@msubaroda.ac.in', 'Neha', 'Patel', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('farhan.khan@amu.ac.in', 'Farhan', 'Khan', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('lavanya.reddy@uohyd.ac.in', 'Lavanya', 'Reddy', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('harsh.gupta@iitd.ac.in', 'Harsh', 'Gupta', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('sana.shaikh@mu.ac.in', 'Sana', 'Shaikh', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('abhishek.das@jaduniv.edu.in', 'Abhishek', 'Das', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('keerthi.menon@cusat.ac.in', 'Keerthi', 'Menon', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('paramjeet.kaur@pu.ac.in', 'Paramjeet', 'Kaur', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO teachers (user_id, university_name, gender, year_joined) VALUES
(1, 'Indian Institute of Science (IISc), Bengaluru', 'male', 2018),
(2, 'University of Delhi, Delhi', 'female', 2020),
(3, 'Anna University, Chennai', 'male', 2019),
(4, 'IIT Bombay, Mumbai', 'female', 2021),
(5, 'Savitribai Phule Pune University, Pune', 'male', 2017),
(6, 'University of Hyderabad, Hyderabad', 'female', 2022),
(7, 'Banaras Hindu University (BHU), Varanasi', 'male', 2016),
(8, 'The Maharaja Sayajirao University of Baroda, Vadodara', 'female', 2019),
(9, 'Aligarh Muslim University, Aligarh', 'male', 2018),
(10, 'University of Hyderabad, Hyderabad', 'female', 2023),
(11, 'IIT Delhi, New Delhi', 'male', 2020),
(12, 'University of Mumbai, Mumbai', 'female', 2018),
(13, 'Jadavpur University, Kolkata', 'male', 2021),
(14, 'Cochin University of Science and Technology, Kochi', 'female', 2019),
(15, 'Panjab University, Chandigarh', 'female', 2017);

