import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'Admin/RequestLeave_Screen.dart';
import 'Attendance_Screen.dart';
import 'Calender_Screen.dart';
import 'Employeedetails_Screen.dart';
import 'LeaveStatus_Screen.dart';
import 'Requestleave_Screen.dart';
import 'WeeklyTimesheet_Screen.dart';



class EmployeeDashboard extends StatefulWidget {
  final Map<String, dynamic> employeeData;
  const EmployeeDashboard({super.key, required this.employeeData});

  @override
  State<EmployeeDashboard> createState() => _EmployeeDashboardState();
}

class _EmployeeDashboardState extends State<EmployeeDashboard> {
  int _currentIndex = 0;
  int _notificationCount = 0;
  List<Map<String, dynamic>> recentActivities = [];

  // Mock notification data
  final List<Map<String, dynamic>> _mockNotifications = [
    {
      'title': 'Meeting Reminder',
      'message': 'Team meeting at 3 PM today',
      'read': false,
      'timestamp': DateTime.now().subtract(const Duration(minutes: 30)),
    },
    {
      'title': 'Leave Approved',
      'message': 'Your leave request has been approved',
      'read': false,
      'timestamp': DateTime.now().subtract(const Duration(hours: 2)),
    },
  ];

  // Mock leave requests
  final List<Map<String, dynamic>> _mockLeaveRequests = [
    {
      'status': 'Approved',
      'startDate': '2023-06-15',
      'endDate': '2023-06-17',
      'leaveType': 'Sick Leave',
      'timestamp': DateTime.now().subtract(const Duration(days: 2)),
    },
    {
      'status': 'Rejected',
      'startDate': '2023-07-01',
      'endDate': '2023-07-05',
      'leaveType': 'Vacation',
      'timestamp': DateTime.now().subtract(const Duration(days: 5)),
    },
  ];

  // Mock holidays
  final List<Map<String, dynamic>> _mockHolidays = [
    {
      'name': 'Independence Day',
      'date': DateTime(2023, 8, 15),
    },
    {
      'name': 'Republic Day',
      'date': DateTime(2023, 1, 26),
    },
  ];

  final Color brandColor = Colors.blue;
  final Color accentColor = Colors.indigo;

  @override
  void initState() {
    super.initState();
    _loadMockData();
  }

  void _loadMockData() {
    // Set notification count
    _notificationCount = _mockNotifications.where((n) => !n['read']).length;

    // Process leave activities
    _processLeaveActivities(_mockLeaveRequests);

    // Add holiday if no recent activities
    if (recentActivities.isEmpty && _mockHolidays.isNotEmpty) {
      final holiday = _mockHolidays.first;
      setState(() {
        recentActivities.add({
          'type': 'Holiday',
          'description': holiday['name'] ?? 'Holiday',
          'date': DateFormat('dd MMM yyyy').format(holiday['date']),
        });
      });
    }
  }

  void _processLeaveActivities(List<Map<String, dynamic>> leaves) {
    List<Map<String, dynamic>> temp = [];
    for (var leave in leaves) {
      final formattedDate = DateFormat('dd MMM yyyy').format(leave['timestamp']);
      final status = leave['status'] ?? '';

      temp.add({
        'type': 'Leave $status',
        'description': '${leave['leaveType']} from ${leave['startDate']} to ${leave['endDate']}',
        'date': formattedDate,
        'status': status,
        'timestamp': leave['timestamp'],
      });
    }

    temp.sort((a, b) => (b['timestamp'] as DateTime).compareTo(a['timestamp'] as DateTime));
    setState(() => recentActivities = temp.take(3).toList());
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }

  void _navigateTo(int index) {
    setState(() => _currentIndex = index);
    Widget screen;
    switch (index) {
      case 1:
        screen = LeaveHistoryScreen();
        break;
      case 2:
        screen = LeaveHistoryScreen();
        break;
      case 3:
        screen = WeeklyTimesheetScreen();
        break;
      default:
        return;
    }
    Navigator.push(context, MaterialPageRoute(builder: (_) => screen));
  }

  Widget _buildShortcut(String title, IconData icon, Widget screen, Color iconColor) {
    return Material(
      color: Colors.white,
      elevation: 1.8,
      borderRadius: BorderRadius.circular(26),
      child: InkWell(
        borderRadius: BorderRadius.circular(26),
        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => screen)),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 6),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                decoration: BoxDecoration(
                  color: iconColor.withOpacity(0.14),
                  border: Border.all(color: iconColor, width: 1.2),
                  shape: BoxShape.circle,
                ),
                child: Padding(
                  padding: const EdgeInsets.all(14.0),
                  child: Icon(icon, color: iconColor, size: 29),
                ),
              ),
              const SizedBox(height: 12),
              Text(title,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 15.2,
                    color: Colors.grey[900],
                  )),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final name = widget.employeeData['name'] ?? 'Harsh Singhal';
    final profileUrl = widget.employeeData['profileUrl'] ?? '';

    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        titleSpacing: 12,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_greeting(),
                style: TextStyle(
                    fontSize: 16, color: Colors.blueGrey[700], fontWeight: FontWeight.w400)),
            Text(name,
                style: TextStyle(
                    fontWeight: FontWeight.w700, fontSize: 21, color: Colors.blueGrey[900])),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: InkWell(
              borderRadius: BorderRadius.circular(100),
              onTap: () {
              },
              child: CircleAvatar(
                radius: 23,
                backgroundColor: Colors.grey[200],
                backgroundImage: profileUrl.isNotEmpty
                    ? NetworkImage(profileUrl)
                    : const AssetImage('assets/images/dpo.png') as ImageProvider,
              ),
            ),
          ),
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                icon: Icon(Icons.notifications, color: Colors.blueGrey[700]),
                onPressed: () async {
                  await Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) => NewAttendanceScreen(employeeData: {},)));
                  setState(() {
                    _notificationCount = 0; // Reset count after viewing
                  });
                },
              ),
              if (_notificationCount > 0)
                Positioned(
                  right: 10,
                  top: 12,
                  child: Container(
                    width: 13,
                    height: 13,
                    decoration: BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),

      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 15),
              GridView.count(
                crossAxisCount: MediaQuery.of(context).size.width < 520 ? 2 : 3,
                crossAxisSpacing: 20,
                mainAxisSpacing: 20,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: 1,
                children: [
                  _buildShortcut(
                      "Holiday",
                      Icons.event,
                      DynamicCalendarWithPicker(),
                      brandColor),
                  _buildShortcut(
                      "Submit Leave",
                      Icons.send,
                      SubmitLeaveRequestPage(),
                      Colors.teal),
                  _buildShortcut(
                      "Profile",
                      Icons.person,
                      PersonalDetailsView(),
                      Colors.orange),
                  _buildShortcut(
                      "My Attendance",
                      Icons.timer,
                      NewAttendanceScreen(employeeData: {},),
                      brandColor),
                  _buildShortcut(
                      "Timesheet",
                      Icons.receipt_long,
                      WeeklyTimesheetScreen(),
                      accentColor),
                  _buildShortcut(
                      "Projects",
                      Icons.folder,
                      LeaveRequestsPage(),
                      Colors.green),
                ],
              ),
              const SizedBox(height: 34),
              Text(
                "Recent Activities",
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 18.3,
                  color: Colors.blueGrey[900],
                ),
              ),
              const SizedBox(height: 13),
              if (recentActivities.isEmpty)
                Center(
                  child: Text(
                    "No recent activities found",
                    style: TextStyle(color: Colors.grey[600], fontSize: 15.5),
                  ),
                )
              else
                Column(
                  children: recentActivities.map((activity) {
                    IconData icon = Icons.info_outline;
                    Color iconColor = brandColor;
                    String title = activity['type'];

                    if (activity['type'].contains('Approved')) {
                      icon = Icons.check_circle_outline;
                      iconColor = Colors.green;
                      title = 'Leave Approved';
                    } else if (activity['type'].contains('Rejected')) {
                      icon = Icons.cancel_outlined;
                      iconColor = Colors.red;
                      title = 'Leave Rejected';
                    } else if (activity['type'].contains('Holiday')) {
                      icon = Icons.celebration_outlined;
                      iconColor = Colors.orange;
                    }

                    return Container(
                      margin: const EdgeInsets.symmetric(vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.07),
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 7),
                        leading: CircleAvatar(
                          backgroundColor: iconColor.withOpacity(0.11),
                          child: Icon(icon, color: iconColor, size: 24),
                        ),
                        title: Text(
                          title,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: iconColor,
                            fontSize: 15.3,
                          ),
                        ),
                        subtitle: Text(
                          activity['description'],
                          style: TextStyle(color: Colors.grey[800], fontSize: 13.6),
                        ),
                        trailing: Text(
                          activity['date'],
                          style: TextStyle(
                              color: Colors.grey[500],
                              fontSize: 12.6,
                              fontWeight: FontWeight.w400),
                        ),
                      ),
                    );
                  }).toList(),
                ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _navigateTo,
        selectedItemColor: brandColor,
        unselectedItemColor: Colors.grey[400],
        backgroundColor: Colors.white,
        elevation: 8,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: "Leave Status"),
          BottomNavigationBarItem(icon: Icon(Icons.folder), label: "Projects"),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: "Setting"),
        ],
      ),
    );
  }
}