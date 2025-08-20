import 'package:flutter/material.dart';
import 'package:intl/intl.dart';


class WeeklyTimesheetScreen extends StatefulWidget {
  const WeeklyTimesheetScreen({super.key});

  @override
  State<WeeklyTimesheetScreen> createState() => _WeeklyTimesheetScreenState();
}

class _WeeklyTimesheetScreenState extends State<WeeklyTimesheetScreen> {
  DateTime? selectedDate;
  bool _isSubmitted = false;
  final List<List<TextEditingController>> _controllers = List.generate(
    5, (_) => List.generate(7, (_) => TextEditingController(text: '0')),
  );

  List<String?> selectedProjects = List.filled(5, null);
  List<String> projectList = [
    'HRM App',
    'E-Commerce App',
    'Inventory Tracker',
    'Payroll System',

  ];

  String _status = 'Draft';
  final List<String> _statusOptions = ['Draft', 'Send for Approval', 'Submitted'];

  List<DateTime> get weekDates {
    if (selectedDate == null) return [];
    final monday = selectedDate!.subtract(Duration(days: selectedDate!.weekday - 1));
    return List.generate(7, (i) => monday.add(Duration(days: i)));
  }

  Future<void> _selectDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2023),
      lastDate: DateTime(2101),
    );
    if (picked != null) {
      setState(() {
        selectedDate = picked;
        _resetForm();
      });
    }
  }

  void _resetForm() {
    for (var row in _controllers) {
      for (var controller in row) {
        controller.text = '0';
      }
    }
    selectedProjects = List.filled(5, null);
    _status = 'Draft';
    _isSubmitted = false;
  }

  int _calculateRowTotal(int row) {
    return _controllers[row].map((c) => int.tryParse(c.text) ?? 0).fold(0, (a, b) => a + b);
  }

  int _calculateDayTotal(int col) {
    return _controllers.map((row) => int.tryParse(row[col].text) ?? 0).fold(0, (a, b) => a + b);
  }

  int get overallTotal {
    int total = 0;
    for (var row in _controllers) {
      for (var controller in row) {
        total += int.tryParse(controller.text) ?? 0;
      }
    }
    return total;
  }

  void _saveTimesheet({bool submit = false}) {
    if (selectedDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select a week date.")),
      );
      return;
    }

    bool hasProjects = selectedProjects.any((project) => project != null);
    if (!hasProjects) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please add at least one project.")),
      );
      return;
    }

    setState(() {
      _isSubmitted = submit;
      _status = submit ? 'Submitted' : 'Draft';
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Timesheet ${submit ? 'submitted' : 'saved'} successfully")),
    );

    if (submit) Navigator.pop(context);
  }



  @override
  Widget build(BuildContext context) {
    final days = weekDates.isEmpty
        ? List.filled(7, '')
        : weekDates.map((d) => DateFormat('EEE\ndd MMM').format(d)).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Center(child: const Text("Weekly Timesheet",)),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0.5,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Center(
            ),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildDatePicker(),
            const SizedBox(height: 16),
            if (weekDates.isNotEmpty)
              Text(
                "Week: ${DateFormat('MMM dd').format(weekDates.first)} - ${DateFormat('MMM dd').format(weekDates.last)}",
                style: const TextStyle(fontWeight: FontWeight.w600,color: Colors.red),
              ),
            const SizedBox(height: 16),

            Expanded(
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: _buildTimesheetTable(days),
              ),
            ),
            const SizedBox(height: 16),
            _buildButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildDatePicker() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Week Starting Date", style: TextStyle(fontWeight: FontWeight.w500)),
        const SizedBox(height: 6),
        InkWell(
          onTap: () => _selectDate(context),
          borderRadius: BorderRadius.circular(8),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(8),
              color: Colors.grey.shade100,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  selectedDate != null
                      ? "${DateFormat('yyyy-MM-dd').format(selectedDate!)}"
                      : 'Pick a date',
                  style: const TextStyle(fontSize: 15),
                ),
                const Icon(Icons.calendar_today, size: 20),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTimesheetTable(List<String> days) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        children: [
          Container(
            decoration: BoxDecoration(
              color: Colors.grey.shade200,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(10)),
            ),
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Row(
              children: [
                _headerCell("#", width: 40),
                _headerCell("Project", width: 140),
                ...days.map((day) => _headerCell(day, width: 70)).toList(),
                _headerCell("Total", width: 70),
              ],
            ),
          ),
          for (int row = 0; row < 5; row++) _buildRow(row),
          _buildSummaryRow(),
        ],
      ),
    );
  }

  Widget _headerCell(String label, {double width = 60}) {
    return SizedBox(
      width: width,
      child: Center(
        child: Text(
          label,
          style: const TextStyle(fontWeight: FontWeight.bold),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  Widget _buildRow(int rowIndex) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: Colors.grey.shade200)),
      ),
      child: Row(
        children: [
          SizedBox(width: 40, child: Center(child: Text('${rowIndex + 1}'))),
          SizedBox(
            width: 140,
            child: DropdownButton<String>(
              isExpanded: true,
              value: selectedProjects[rowIndex],
              hint: const Text("Select", style: TextStyle(fontSize: 14)),
              items: projectList.map((proj) =>
                  DropdownMenuItem(
                    value: proj,
                    child: Text(proj, style: const TextStyle(fontSize: 14)),
                  )
              ).toList(),
              onChanged: _isSubmitted ? null : (val) => setState(() => selectedProjects[rowIndex] = val),
              underline: Container(),
              icon: const Icon(Icons.arrow_drop_down, size: 20),
            ),
          ),
          for (int col = 0; col < 7; col++)
            SizedBox(
              width: 70,
              child: TextField(
                controller: _controllers[rowIndex][col],
                enabled: !_isSubmitted,
                keyboardType: TextInputType.number,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14),
                decoration: InputDecoration(
                  contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  filled: true,
                  fillColor: Colors.grey.shade50,
                  border: OutlineInputBorder(
                    borderSide: BorderSide.none,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                onChanged: (_) => setState(() {}),
              ),
            ),
          SizedBox(
            width: 70,
            child: Center(
              child: Text(
                '${_calculateRowTotal(rowIndex)}',
                style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(10)),
      ),
      child: Row(
        children: [
          const SizedBox(width: 40),
          const SizedBox(
            width: 140,
            child: Center(
              child: Text(
                'Total',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
          for (int i = 0; i < 7; i++)
            SizedBox(
              width: 70,
              child: Center(
                child: Text(
                  '${_calculateDayTotal(i)}',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
              ),
            ),
          SizedBox(
            width: 70,
            child: Center(
              child: Text(
                '$overallTotal',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButtons() {
    return Row(
      children: [
        OutlinedButton(
          onPressed: () => Navigator.pop(context),
          style: OutlinedButton.styleFrom(
            foregroundColor: Colors.black,
            side: BorderSide(color: Colors.grey.shade300),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          child: const Text("Back"),
        ),
        const Spacer(),
        if (!_isSubmitted) ...[
          OutlinedButton(
            onPressed: () => _saveTimesheet(),
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.blue,
              side: BorderSide(color: Colors.blue.shade300),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            ),
            child: const Text("Save Draft"),
          ),
          const SizedBox(width: 12),
        ],
        ElevatedButton(
          onPressed: _isSubmitted ? null : () => _saveTimesheet(submit: true),
          style: ElevatedButton.styleFrom(
            backgroundColor: _isSubmitted ? Colors.grey : Colors.blue,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
          child: Text(
            _isSubmitted ? "Submitted" : "Submit Timesheet",
            style: const TextStyle(color: Colors.white),
          ),
        ),
      ],
    );
  }
}