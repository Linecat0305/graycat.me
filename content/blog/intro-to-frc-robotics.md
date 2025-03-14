---
title: "FRC機器人競賽入門：從零開始的機器人程式設計"
date: "2025-03-16"
description: "本文介紹FIRST機器人競賽(FRC)的基本概念，以及如何開始進行機器人的程式設計和控制系統開發。"
tags: ["機器人", "FRC", "Java", "控制系統", "程式設計"]
---

FIRST機器人競賽(FIRST Robotics Competition, FRC)是一項國際性的高中生機器人競賽，每年吸引超過4,000支隊伍參與。在這個競賽中，學生們需要在有限的時間內設計、構建和程式設計一台機器人來完成特定的挑戰任務。本文將介紹FRC機器人程式設計的基礎知識，幫助新手團隊快速入門。

## FRC競賽概述

### 什麼是FRC？

FRC是FIRST (For Inspiration and Recognition of Science and Technology) 組織舉辦的旗艦賽事，旨在激發學生對科學、技術、工程和數學(STEM)的熱情。每年1月，FIRST會公布當年的競賽規則和任務，參賽隊伍有6-8週的時間來設計和構建機器人。

### 競賽形式

競賽通常包括：
- **自動階段(Autonomous Period)** - 機器人完全依靠預先編寫的程式執行任務
- **遙控階段(Teleoperated Period)** - 隊員通過控制器操控機器人
- **終局階段(Endgame)** - 特殊任務，通常需要機器人展示高級功能

## FRC機器人控制系統

### 硬體架構

FRC機器人的標準控制系統包括：

1. **roboRIO** - NI公司提供的主控制器，運行機器人程式
2. **電源分配板(Power Distribution Panel, PDP)** - 管理機器人的電力分配
3. **馬達控制器** - 控制各種馬達，如Talon SRX、Spark MAX等
4. **氣動控制模組(Pneumatic Control Module, PCM)** - 控制氣動系統
5. **各種感測器** - 如編碼器、陀螺儀、加速度計等
6. **視覺處理系統** - 如Limelight、Raspberry Pi等

### 軟體開發環境

FRC機器人程式主要支持三種程式語言：
- **Java** - 最常用的選擇，適合有物件導向程式設計經驗的團隊
- **C++** - 提供更高的效能，但有較高的學習曲線
- **LabVIEW** - 視覺化程式設計語言，適合初學者

## WPILib：FRC程式設計的基礎

WPILib是FRC官方提供的程式庫，包含控制機器人所需的各種功能。

### 安裝開發環境

首先需要安裝FRC開發環境：

1. 下載並安裝WPILib安裝包：[https://github.com/wpilibsuite/allwpilib/releases](https://github.com/wpilibsuite/allwpilib/releases)
2. 安裝包會設置所有必要的工具，包括Visual Studio Code和必要的外掛

### 創建第一個機器人專案

使用WPILib創建新專案非常簡單：

1. 打開Visual Studio Code
2. 按下Ctrl+Shift+P打開命令面板
3. 輸入"WPILib: Create a new project"
4. 選擇專案類型（如命令式Java專案）
5. 設置專案名稱和位置
6. 選擇程式語言（Java、C++或LabVIEW）
7. 選擇專案基礎（如TimedRobot, Command Robot等）

### 機器人程式的基本結構

以Java為例，一個基本的TimedRobot程式結構如下：

```java
package frc.robot;

import edu.wpi.first.wpilibj.TimedRobot;
import edu.wpi.first.wpilibj.smartdashboard.SendableChooser;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;

public class Robot extends TimedRobot {
  // 初始化變數和對象
  
  @Override
  public void robotInit() {
    // 機器人啟動時執行一次
  }

  @Override
  public void robotPeriodic() {
    // 機器人啟動後持續執行
  }

  @Override
  public void autonomousInit() {
    // 自動階段開始時執行一次
  }

  @Override
  public void autonomousPeriodic() {
    // 自動階段持續執行
  }

  @Override
  public void teleopInit() {
    // 遙控階段開始時執行一次
  }

  @Override
  public void teleopPeriodic() {
    // 遙控階段持續執行
  }
}
```

## 基本控制系統開發

### 驅動系統(Drivetrain)

驅動系統是機器人最基本的部分，控制機器人的移動。以下是一個簡單的差速驅動(Differential Drive)實現：

```java
import edu.wpi.first.wpilibj.motorcontrol.PWMSparkMax;
import edu.wpi.first.wpilibj.drive.DifferentialDrive;
import edu.wpi.first.wpilibj.XboxController;

// 初始化馬達和控制器
PWMSparkMax leftMotor = new PWMSparkMax(0);
PWMSparkMax rightMotor = new PWMSparkMax(1);
DifferentialDrive drive = new DifferentialDrive(leftMotor, rightMotor);
XboxController controller = new XboxController(0);

// 在teleopPeriodic方法中控制移動
public void teleopPeriodic() {
  // 使用Xbox控制器的左搖桿控制機器人移動
  double speed = -controller.getLeftY(); // 前後移動
  double rotation = controller.getRightX(); // 轉向
  
  // 應用曲線調整使控制更平滑
  speed = Math.copySign(speed * speed, speed);
  rotation = Math.copySign(rotation * rotation, rotation);
  
  drive.arcadeDrive(speed, rotation);
}
```

### 使用Command-Based框架

Command-Based框架是一種更結構化的程式設計方法，推薦用於較複雜的機器人：

```java
// 創建一個簡單的驅動指令
public class DriveCommand extends CommandBase {
  private final DriveSubsystem m_drive;
  private final XboxController m_controller;
  
  public DriveCommand(DriveSubsystem subsystem, XboxController controller) {
    m_drive = subsystem;
    m_controller = controller;
    addRequirements(m_drive);
  }
  
  @Override
  public void execute() {
    double speed = -m_controller.getLeftY();
    double rotation = m_controller.getRightX();
    m_drive.arcadeDrive(speed, rotation);
  }
}
```

### 傳感器整合

整合傳感器以增強機器人的自主性和精確性：

```java
// 使用編碼器追蹤距離
Encoder leftEncoder = new Encoder(0, 1);
Encoder rightEncoder = new Encoder(2, 3);

// 設置編碼器分辨率
leftEncoder.setDistancePerPulse(Math.PI * wheelDiameter / encoderResolution);
rightEncoder.setDistancePerPulse(Math.PI * wheelDiameter / encoderResolution);

// 使用陀螺儀追蹤方向
ADXRS450_Gyro gyro = new ADXRS450_Gyro();

// 在自動階段中使用PID控制器維持方向
PIDController turnController = new PIDController(kP, kI, kD);
```

## 高級主題

### 視覺處理

使用Limelight等工具進行目標識別和追蹤：

```java
NetworkTable table = NetworkTableInstance.getDefault().getTable("limelight");
NetworkTableEntry tx = table.getEntry("tx");
NetworkTableEntry ty = table.getEntry("ty");
NetworkTableEntry ta = table.getEntry("ta");

// 讀取視覺數據
double x = tx.getDouble(0.0); // 水平偏移
double y = ty.getDouble(0.0); // 垂直偏移
double area = ta.getDouble(0.0); // 目標區域大小

// 使用視覺數據調整機器人對準目標
double headingError = x;
double steeringAdjust = headingError * kP;
drive.arcadeDrive(0, steeringAdjust);
```

### 路徑規劃

使用WPILib的軌跡功能實現複雜的自動移動：

```java
// 定義軌跡點
Pose2d start = new Pose2d(0, 0, new Rotation2d(0));
Pose2d end = new Pose2d(3, 3, new Rotation2d(Math.PI/2));

// 生成軌跡
Trajectory trajectory = TrajectoryGenerator.generateTrajectory(
    start, 
    List.of(new Translation2d(1, 1), new Translation2d(2, 2)), 
    end, 
    new TrajectoryConfig(2.0, 1.0)
);

// 創建跟隨軌跡的命令
RamseteCommand ramseteCommand = new RamseteCommand(
    trajectory,
    this::getPose,
    new RamseteController(2.0, 0.7),
    new SimpleMotorFeedforward(ks, kv, ka),
    kinematics,
    this::getWheelSpeeds,
    new PIDController(kP, 0, 0),
    new PIDController(kP, 0, 0),
    this::tankDriveVolts,
    this
);
```

## 效能提升和除錯技巧

### 代碼優化

1. **減少記憶體分配** - 避免在循環中創建新對象
2. **使用NetworkTables調整參數** - 在比賽中快速調整機器人表現
3. **實現平滑控制** - 使用曲線調整和斜坡限制避免突然的運動變化

### 除錯工具

1. **Driver Station日誌** - 檢查基本的運行時錯誤
2. **SmartDashboard/Shuffleboard** - 視覺化機器人數據和狀態
3. **Glass** - 視覺化機器人位置和移動軌跡
4. **Outlineviewer** - 檢查NetworkTable數據
5. **RobotBuilder** - 視覺化設計機器人系統

## 總結

FRC機器人程式設計是一個既有挑戰性又有趣的過程。成功的機器人程式設計需要團隊合作、創新思維和持續的測試與改進。通過掌握本文介紹的基礎知識，新團隊可以更快地上手FRC機器人開發，並在競賽中取得更好的成績。

對於想要更深入了解FRC程式設計的團隊，建議參考以下資源：
- WPILib官方文檔: [https://docs.wpilib.org/en/stable/](https://docs.wpilib.org/en/stable/)
- Chief Delphi論壇: [https://www.chiefdelphi.com/](https://www.chiefdelphi.com/)
- FRC Discord社群

---

> "機器人競賽不僅是技術的比拼，更是團隊協作和創新思維的展示。" — GrayCat