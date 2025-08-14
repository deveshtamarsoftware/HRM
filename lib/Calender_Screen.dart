import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'Attendance_Screen.dart';
import 'Employeedetails_Screen.dart';
import 'Home_Screen.dart';
import 'LeaveStatus_Screen.dart';


class DynamicCalendarWithPicker extends StatefulWidget {
  @override
  _DynamicCalendarWithPickerState createState() => _DynamicCalendarWithPickerState();
}

class _DynamicCalendarWithPickerState extends State<DynamicCalendarWithPicker> {
  Map<DateTime, String> leaveTypes = {};
  String selectedType = 'approved';

  void _addLeave(DateTime date) {
    setState(() {
      leaveTypes[DateTime(date.year, date.month, date.day)] = selectedType;
    });
  }

  Color? _getColor(DateTime date) {

    String? type = leaveTypes[DateTime(date.year, date.month, date.day)];
    if (type != null) {
      switch (type) {
        case 'holiday':
          return Colors.blue;
        case 'approved':
          return Colors.green;
        case 'pending':
          return Colors.red;
        case 'planned':
          return Colors.orange;
      }
    } else if (date.weekday == DateTime.saturday || date.weekday == DateTime.sunday) {
      return Colors.grey[500];
    }
    return null;
  }

  Widget _legendItem(String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 12, height: 12, color: color),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  Widget _buildLegend() {
    return Wrap(
      spacing: 10,
      children: [
        _legendItem("Holiday", Colors.blue),
        _legendItem("Weekend", Colors.grey),
        _legendItem("Pending", Colors.red),
        _legendItem("Approved", Colors.green),
        _legendItem("Planned", Colors.orange),
      ],
    );
  }

  Widget _buildLeaveTypeButtons() {
    final types = ['holiday', 'approved', 'pending', 'planned'];
    return Wrap(
      spacing: 10,
      children: types.map((type) {
        final isSelected = type == selectedType;
        return ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: isSelected ? Colors.black : Colors.grey[300],
            foregroundColor: isSelected ? Colors.white : Colors.black,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          ),
          onPressed: () => setState(() => selectedType = type),
          child: Text(type[0].toUpperCase() + type.substring(1), style: const TextStyle(fontSize: 12)),
        );
      }).toList(),
    );
  }

  Widget _buildDateBox(DateTime date) {
    Color? color = _getColor(date);
    return Container(
      margin: const EdgeInsets.all(2),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: Colors.grey.shade400),
      ),
      child: Center(
        child: Text('${date.day}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildMonthView(DateTime month) {
    int daysInMonth = DateUtils.getDaysInMonth(month.year, month.month);
    List<Widget> dayWidgets = [];

    DateTime firstDay = DateTime(month.year, month.month, 1);
    int startWeekday = firstDay.weekday % 7;

    for (int i = 0; i < startWeekday; i++) {
      dayWidgets.add(Container());
    }

    for (int day = 1; day <= daysInMonth; day++) {
      DateTime date = DateTime(month.year, month.month, day);
      dayWidgets.add(_buildDateBox(date));
    }

    return Column(
      children: [
        Text(DateFormat('MMMM yyyy').format(month),
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 5),
        GridView.count(
          crossAxisCount: 7,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          children: dayWidgets,
        ),
      ],
    );
  }

  Widget _buildHorizontalMonthPager() {
    return PageView.builder(
      scrollDirection: Axis.horizontal,
      itemCount: 12,
      itemBuilder: (context, index) {
        final month = DateTime(DateTime.now().year, index + 1, 1);
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12.0),
          child: _buildMonthView(month),
        );
      },
    );
  }

  Future<void> _pickDateAndApplyLeave() async {
    DateTime now = DateTime.now();
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: DateTime(now.year - 1),
      lastDate: DateTime(now.year + 1),
    );

    if (picked != null) {
      _addLeave(picked);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Leave applied for ${DateFormat('MMM dd, yyyy').format(picked)}")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          leading: IconButton(icon: Icon(Icons.arrow_back),
            onPressed:(){
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => EmployeeDashboard(employeeData: {},),));
            },
          ),

          title: const Text("Holiday & Leave Calendar")),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            _buildLegend(),
            const SizedBox(height: 30),
            _buildLeaveTypeButtons(),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _pickDateAndApplyLeave,
              icon: const Icon(Icons.calendar_today),
              label: const Text("Select Date for Leave"),
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20)),
            ),
            const SizedBox(height: 18),
            Expanded(child: _buildHorizontalMonthPager()),
          ],
        ),
      ),
    );
  }
}
