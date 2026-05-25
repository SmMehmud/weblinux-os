/* =============================================
   main.js — Register All Apps & Boot OS
   ============================================= */

[
  // System
  Terminal, FileManager, TextEditor, WebBrowser,
  Settings, TaskManager, SystemInfo, LogViewer,
  SearchApp, NetworkMonitor, DiskUsage,
  ProcessManager, BackupApp,

  // Accessories
  Calculator, CalculatorSci, CalculatorProgrammer,
  Notes, UnitConverter, MarkdownPreview,
  JSONFormatter, Base64Tool, PasswordGen,
  ColorPicker, QRGenerator, Calendar,
  ClockApp, Stopwatch, Timer, WorldClock,
  ASCIIArt, RegexTester, HTMLPreview,
  CodeEditor, Spreadsheet, FortuneCookie,
  TextToSpeech,

  // Games
  Minesweeper, Snake, Tetris, Pong, TicTacToe,
  MemoryGame, Sudoku, Chess, WordGuess,
  Game2048, FlappyBird, DinoRun, SpaceShooter,
  Breakout, MazeGame, PingPong,

  // Graphics
  PaintApp, DrawingBoard, ImageViewer,
  FractalViewer, ColorPalette, AudioVisualizer,

  // Internet
  Weather, WeatherForecast, ChatApp, EmailApp,
  TranslatorApp, RSSReader, WikiSearch, IPLookup,

  // Utilities
  RandomNumber, DiceRoller, CoinFlip,
  RockPaperScissors, BMICalc, AgeCalc,
  LoanCalc, TipCalc, PercentageCalc,
  MusicPlayer, VideoPlayer, Camera, VoiceRecorder

].forEach(a => OS.registerApp(a));

OS.init();
