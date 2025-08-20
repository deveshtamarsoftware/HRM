import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:slide_to_act/slide_to_act.dart';



// Your actual screen:
class NewAttendanceScreen extends StatefulWidget {
  final Map<String, dynamic> employeeData;
  const NewAttendanceScreen({super.key, required this.employeeData});
  @override
  State<NewAttendanceScreen> createState() => _NewAttendanceScreenState();
}

class _NewAttendanceScreenState extends State<NewAttendanceScreen>
    with SingleTickerProviderStateMixin {
  late Timer _timer;
  late String _timeString;
  late String _dateString;
  bool isCheckedIn = false;
  DateTime? checkInTime;
  DateTime? checkOutTime;
  List<Map<String, dynamic>> lastFiveRecords = [];
  double totalWorkedHours = 42.5;
  String _currentAddress = "Logix Technova sector 132, Noida";
  final GlobalKey<SlideActionState> _slideKey = GlobalKey();
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _updateTime();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) => _updateTime());
    _generateDummyData();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 450),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    _animationController.forward();
  }

  void _updateTime() {
    final now = DateTime.now();
    setState(() {
      _timeString = DateFormat('hh:mm:ss a').format(now);
      _dateString = DateFormat('dd MMM yyyy').format(now);
    });
  }

  void _generateDummyData() {
    final now = DateTime.now();
    lastFiveRecords = List.generate(5, (index) {
      final date = now.subtract(Duration(days: index + 1));
      final checkIn = date.add(Duration(hours: 9, minutes: 15 + index));
      final checkOut = date.add(Duration(hours: 18, minutes: index % 3));
      return {
        'date': DateFormat('dd MMM yyyy').format(date),
        'checkIn': DateFormat('hh:mm a').format(checkIn),
        'checkOut': DateFormat('hh:mm a').format(checkOut),
        'checkInLocation': 'Logix Technova 132, Noida',
        'checkOutLocation': 'Logix Technova 132, Noida',
      };
    }).reversed.toList();
  }

  Future<void> _handleSlideComplete() async {
    final now = DateTime.now();
    if (!isCheckedIn) {
      setState(() {
        checkInTime = now;
        isCheckedIn = true;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Checked in successfully!'),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } else {
      setState(() {
        checkOutTime = now;
        isCheckedIn = false;
      });
      final newRecord = {
        'date': _dateString,
        'checkIn': DateFormat('hh:mm a').format(checkInTime!),
        'checkOut': DateFormat('hh:mm a').format(now),
        'checkInLocation': _currentAddress,
        'checkOutLocation': _currentAddress,
      };
      setState(() {
        lastFiveRecords.insert(0, newRecord);
        if (lastFiveRecords.length > 5) {
          lastFiveRecords = lastFiveRecords.sublist(0, 5);
        }
      });
      final worked = checkOutTime!.difference(checkInTime!);
      totalWorkedHours += worked.inMinutes / 60.0;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Checked out successfully!'),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
    _slideKey.currentState?.reset();
    _animationController.reset();
    _animationController.forward();
  }

  String _formatTotalWorkedHours(double hours) {
    final hr = hours.floor();
    final min = ((hours - hr) * 60).round();
    return '$hr hr ${min.toString().padLeft(2, '0')} min';
  }

  @override
  void dispose() {
    _timer.cancel();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final greeting = widget.employeeData['name'] ?? 'Harsh'; // make sure to use a key here!

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
      appBar: AppBar(

        title: const Text("Attendance Dashboard"),
        backgroundColor: Color(0xFF66ABEF),
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
        //elevation: 1,
        centerTitle: true,
       // scrolledUnderElevation: 8,
      ),
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 22),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting card
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: Theme.of(context).colorScheme.primaryContainer,
                        child: Icon(
                          Icons.person,
                          color: Theme.of(context).colorScheme.primary,
                          size: 34,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Hello, $greeting",
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              "$_dateString | $_timeString",
                              style: TextStyle(
                                fontSize: 16,
                                color: Theme.of(context).colorScheme.secondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),
              _buildTodayCard(context),
              const SizedBox(height: 24),
              // Slide action button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18),
                child: SlideAction(
                  key: _slideKey,
                  borderRadius: 28,
                  elevation: 7,
                  innerColor: isCheckedIn ? Colors.red[600]! : Colors.green[600]!,
                  outerColor: isCheckedIn ? Colors.red[100]! : Colors.green[100]!,
                  sliderButtonIcon: Icon(isCheckedIn ? Icons.logout : Icons.login, color: Colors.white),
                  text: isCheckedIn ? 'Slide to Check Out' : 'Slide to Check In',
                  textStyle: const TextStyle(color: Colors.black87, fontSize: 16, fontWeight: FontWeight.w600),
                  onSubmit: _handleSlideComplete,
                  height: 56,
                  sliderButtonYOffset: -2,
                ),
              ),
              const SizedBox(height: 28),
              _buildSummaryCard(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTodayCard(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Today's Activity",
                style: TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary
                )),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildInfoColumn("Check In", checkInTime != null ? DateFormat('hh:mm a').format(checkInTime!) : '--', context),
                _buildInfoColumn("Check Out", checkOutTime != null ? DateFormat('hh:mm a').format(checkOutTime!) : '--', context),
              ],
            ),
            const SizedBox(height: 18),
            Text("Current Location:", style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.secondary)),
            const SizedBox(height: 4),
            Text(_currentAddress, style: TextStyle(fontSize: 14)),
            const SizedBox(height: 16),
            Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 9),
                decoration: BoxDecoration(
                  color: isCheckedIn
                      ? Colors.green.withOpacity(.1)
                      : Colors.blue.withOpacity(.09),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(
                    color: isCheckedIn ? Colors.green : Colors.blue,
                    width: 1,
                  ),
                ),
                child: Text(
                  isCheckedIn ? "Currently Checked In" : "Not Checked In",
                  style: TextStyle(
                    color: isCheckedIn ? Colors.green : Colors.blue,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryCard(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Attendance Summary", style: TextStyle(
                fontSize: 19,
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.primary)),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 11, horizontal: 16),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.timer, color: Colors.indigo),
                  const SizedBox(width: 12),
                  Text("Total Worked: ${_formatTotalWorkedHours(totalWorkedHours)}",
                      style: TextStyle(
                        fontSize: 16,
                        color: Theme.of(context).colorScheme.onPrimaryContainer,
                        fontWeight: FontWeight.w600,
                      )),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text("Last 5 Attendance Records",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Theme.of(context).colorScheme.primary)),
            const SizedBox(height: 13),
            lastFiveRecords.isEmpty
                ? const Padding(
              padding: EdgeInsets.all(18),
              child: Center(
                child: Text(
                  "No records found",
                  style: TextStyle(color: Colors.grey, fontSize: 16),
                ),
              ),
            )
                : ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: lastFiveRecords.length,
              separatorBuilder: (context, index) => const Divider(height: 16),
              itemBuilder: (context, index) {
                final record = lastFiveRecords[index];
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surfaceVariant,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(record['date'],
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.green[50],
                              borderRadius: BorderRadius.circular(24),
                              border: Border.all(color: Colors.green),
                            ),
                            child: const Text("Completed", style: TextStyle(color: Colors.green)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Icon(Icons.login, color: Colors.green[700], size: 20),
                          const SizedBox(width: 7),
                          Text("In: ${record['checkIn']}", style: const TextStyle(fontWeight: FontWeight.w500)),
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.only(left: 32, top: 1),
                        child: Text(
                          record['checkInLocation'] ?? '',
                          style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(Icons.logout, color: Colors.red[700], size: 20),
                          const SizedBox(width: 7),
                          Text("Out: ${record['checkOut']}", style: const TextStyle(fontWeight: FontWeight.w500)),
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.only(left: 32, top: 1),
                        child: Text(
                          record['checkOutLocation'] ?? '',
                          style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoColumn(String title, String value, BuildContext context) {
    return Column(
      children: [
        Text(title,
            style: TextStyle(fontSize: 14, color: Theme.of(context).colorScheme.secondary, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ],
    );
  }
}