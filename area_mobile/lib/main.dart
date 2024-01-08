import 'package:area_mobile/views/boards_view.dart';
import 'package:area_mobile/views/login_view.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:area_mobile/widgets/bottom_nav_bar.dart';
import 'package:area_mobile/area_theme.dart';
import 'package:area_mobile/views/areas_view.dart';
import 'package:area_mobile/views/profile_view.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(
    MaterialApp(
      title: 'Flutter Demo',
      theme: areaTheme,
      home: const AuthChecker(),
    ),
  );
}

class AuthChecker extends StatelessWidget {
  const AuthChecker({super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<User?>(
      future: FirebaseAuth.instance.authStateChanges().first,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator();
        } else if (snapshot.connectionState == ConnectionState.done) {
          return const HomePage(title: 'Boards');
        } else {
          return const LoginView();
        }
      },
    );
  }
}

class Area extends StatelessWidget {
  const Area({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Area',
      theme: areaTheme,
      home: const LoginView(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key, required this.title});

  final String title;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: CustomBottomNavigationBar(
        onItemTapped: _onItemTapped,
        selectedItem: _selectedIndex,
      ),
      body: _getBody(),
    );
  }

  Widget _getBody() {
    switch (_selectedIndex) {
      case 0:
        return const BoardsView();
      case 1:
        return const AreasView();
      case 2:
        return const ProfileView();
      default:
        return const Text('Invalid index');
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
}
