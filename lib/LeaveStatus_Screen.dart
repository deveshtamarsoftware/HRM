import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'Leavetracker_Screen.dart';

// ================== History Screen =====
class LeaveHistoryScreen extends StatefulWidget {
  const LeaveHistoryScreen({super.key});

  @override
  State<LeaveHistoryScreen> createState() => _LeaveHistoryScreenState();
}

class _LeaveHistoryScreenState extends State<LeaveHistoryScreen> {
  final List<Map<String, dynamic>> leaveRequests = [
    {
      'date': '2025-08-07',
      'type': 'Sick Leave',
      'reason': 'Fever and rest',
      'status': 1,
      'approved': null,
    },
    {
      'date': '2025-08-02',
      'type': 'Planned Leave',
      'reason': 'Trip to hometown',
      'status': 2,
      'approved': true,
    },
    {
      'date': '2025-08-04',
      'type': 'Casual Leave',
      'reason': 'Family Function',
      'status': 2,
      'approved': false,
    },
    {
      'date': '2025-07-28',
      'type': 'Half Day',
      'reason': 'Doctor Visit',
      'status': 0,
      'approved': null,
    },
    {
      'date': '2025-03-15',
      'type': 'Vacation',
      'reason': 'Family vacation',
      'status': 2,
      'approved': true,
    },
    {
      'date': '2025-02-10',
      'type': 'Sick Leave',
      'reason': 'Flu',
      'status': 2,
      'approved': true,
    },
    {
      'date': '2024-12-20',
      'type': 'Planned Leave',
      'reason': 'Year-end break',
      'status': 2,
      'approved': true,
    },
    {
      'date': '2024-11-05',
      'type': 'Casual Leave',
      'reason': 'Personal work',
      'status': 2,
      'approved': false,
    },  {
      'date': '2025-08-12',
      'type': 'Planned Leave',
      'reason': 'Year-end break',
      'status':1,
      'approved': true,
    },
    {
      'date': '2025-09-05',
      'type': 'Casual Leave',
      'reason': 'Personal work',
      'status': 2,
      'approved': false,
    },

  ];

  final TextEditingController _searchController = TextEditingController();
  List<Map<String, dynamic>> filteredLeaves = [];
  DateTimeRange? _selectedDateRange;
  String? _selectedStatus;

  @override
  void initState() {
    super.initState();
    filteredLeaves = leaveRequests;
    _searchController.addListener(_filterLeaves);
  }

  void _filterLeaves() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      filteredLeaves = leaveRequests.where((leave) {
        // Text search filter
        final matchesText = query.isEmpty ||
            leave['type'].toLowerCase().contains(query) ||
            leave['date'].toLowerCase().contains(query) ||
            leave['reason'].toLowerCase().contains(query);

        // Date range filter
        final leaveDate = DateTime.parse(leave['date']);
        final matchesDate = _selectedDateRange == null ||
            (leaveDate.isAfter(_selectedDateRange!.start) &&
                leaveDate.isBefore(_selectedDateRange!.end));

        // Status filter
        final matchesStatus = _selectedStatus == null ||
            _selectedStatus == 'All' ||
            (_selectedStatus == 'Approved' && leave['status'] == 2 && leave['approved'] == true) ||
            (_selectedStatus == 'Rejected' && leave['status'] == 2 && leave['approved'] == false) ||
            (_selectedStatus == 'Pending' && leave['status'] < 2);

        return matchesText && matchesDate && matchesStatus;
      }).toList();
    });
  }

  Future<void> _selectDateRange(BuildContext context) async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
      initialDateRange: _selectedDateRange,
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            primaryColor: const Color(0xFF1976D2),
            colorScheme: const ColorScheme.light(primary: Color(0xFF1976D2)),
            buttonTheme: const ButtonThemeData(textTheme: ButtonTextTheme.primary),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _selectedDateRange = picked;
        _filterLeaves();
      });
    }
  }

  void _clearDateFilter() {
    setState(() {
      _selectedDateRange = null;
      _filterLeaves();
    });
  }

  Color _getStatusColor(int status, bool? approved) {
    if (status == 2) {
      return approved == true ? Colors.green : Colors.red;
    }
    if (status == 1) return const Color(0xFF1976D2);
    return const Color(0xFF9E9E9E);
  }

  String _getStatusText(int status, bool? approved) {
    if (status == 2) return approved == true ? 'Approved' : 'Rejected';
    if (status == 1) return 'Under Review';
    return 'Applied';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text("Leave History", style: TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFF1976D2),
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_alt),
            onPressed: () => _selectDateRange(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search leave history...',
                prefixIcon: const Icon(Icons.search, color: Color(0xFF1976D2)),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Colors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              ),
            ),
          ),

          // Date Range Filter Chip
          if (_selectedDateRange != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Chip(
                label: Text(
                  '${DateFormat('MMM dd, yyyy').format(_selectedDateRange!.start)} - ${DateFormat('MMM dd, yyyy').format(_selectedDateRange!.end)}',
                  style: const TextStyle(color: Colors.white),
                ),
                backgroundColor: const Color(0xFF1976D2),
                deleteIcon: const Icon(Icons.close, size: 18, color: Colors.white),
                onDeleted: _clearDateFilter,
              ),
            ),

          // Status Filter Chips
          SizedBox(
            height: 60,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _buildFilterChip('All'),
                _buildFilterChip('Approved'),
                _buildFilterChip('Rejected'),
                _buildFilterChip('Pending'),
              ],
            ),
          ),

          // Leave List
          Expanded(
            child: filteredLeaves.isEmpty
                ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.search_off, size: 48, color: Colors.grey),
                  SizedBox(height: 16),
                  Text("No matching leave records found",
                      style: TextStyle(color: Colors.grey)),
                ],
              ),
            )
                : ListView.builder(
              itemCount: filteredLeaves.length,
              padding: const EdgeInsets.only(bottom: 16),
              itemBuilder: (context, index) {
                final leave = filteredLeaves[index];
                return _buildLeaveCard(leave, context);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    final isSelected = _selectedStatus == label;
    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (bool value) {
          setState(() {
            _selectedStatus = value ? label : null;
            _filterLeaves();
          });
        },
        backgroundColor: Colors.white,
        selectedColor: const Color(0xFF1976D2),
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : const Color(0xFF1976D2),
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
      ),
    );
  }

  Widget _buildLeaveCard(Map<String, dynamic> leave, BuildContext context) {
    final statusColor = _getStatusColor(leave['status'], leave['approved']);
    final statusText = _getStatusText(leave['status'], leave['approved']);
    final leaveDate = DateTime.parse(leave['date']);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => LeaveTrackerScreen(leaveData: leave),
            ),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        leave['type'],
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF333333),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        DateFormat('MMM dd, yyyy').format(leaveDate),
                        style: const TextStyle(
                          color: Color(0xFF666666),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: statusColor),
                    ),
                    child: Text(
                      statusText,
                      style: TextStyle(
                        color: statusColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Icon(Icons.note, size: 18, color: Color(0xFF1976D2)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      leave['reason'],
                      style: const TextStyle(color: Color(0xFF666666)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              const Divider(height: 1),
              Padding(
                padding: const EdgeInsets.only(top: 12.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      'View Tracker',
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(Icons.arrow_forward, size: 16,
                        color: Theme.of(context).primaryColor),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}