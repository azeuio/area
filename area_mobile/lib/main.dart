import 'package:flutter/material.dart';
import 'package:area_mobile/widgets/bottom_nav_bar.dart';
import 'package:area_mobile/area_theme.dart';
import 'package:area_mobile/views/boards_view.dart';
import 'package:area_mobile/views/areas_view.dart';
import 'package:area_mobile/views/profile_view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: areaTheme,
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    const List<Widget> _pages = <Widget>[
      BoardsPage(),
      AreasPage(),
      ProfilePage(),
    ];

    return Scaffold(
      bottomNavigationBar: CustomBottomNavigationBar(
        onItemTapped: _onItemTapped,
        selectedItem: _selectedIndex,
      ),
      body: Center(
        child: _pages.elementAt(_selectedIndex),
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
}
