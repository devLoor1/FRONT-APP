import RBSheet from "react-native-raw-bottom-sheet";

type InferRef<T> = T extends React.ForwardRefExoticComponent<infer Ref>
  ? Ref extends React.RefAttributes<infer RefElement>
    ? RefElement
    : never
  : never;

type RBSheetRef = InferRef<typeof RBSheet>;

export default RBSheetRef;
