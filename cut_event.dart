import 'dart:async';
import 'dart:developer' as developer;

import 'package:flutter_filesundefined/index.dart';
import 'package:meta/meta.dart';

@immutable
abstract class CutEvent {
  Stream<CutState> applyAsync(
      {CutState currentState, CutBloc bloc});
}

class UnCutEvent extends CutEvent {
  @override
  Stream<CutState> applyAsync({CutState? currentState, CutBloc? bloc}) async* {
    yield UnCutState();
  }
}

class LoadCutEvent extends CutEvent {
   
  @override
  Stream<CutState> applyAsync(
      {CutState? currentState, CutBloc? bloc}) async* {
    try {
      yield UnCutState();
      await Future.delayed(const Duration(seconds: 1));
      yield InCutState('Hello world');
    } catch (_, stackTrace) {
      developer.log('$_', name: 'LoadCutEvent', error: _, stackTrace: stackTrace);
      yield ErrorCutState( _.toString());
    }
  }
}
