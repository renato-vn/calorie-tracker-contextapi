import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useMemo,
  useReducer,
} from "react";
import {
  ActivityActions,
  activityReducer,
  ActivityState,
  initialState,
} from "../reducers/activity-reducer";
import { categories } from "../data/calories";
import { Activity } from "../interfaces";

interface ActivityContextProps {
  state: ActivityState;
  dispatch: Dispatch<ActivityActions>;
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
  categoryName: (category: Activity["category"]) => string[];
  isEmptyActivities: boolean;
  handleEdit: (activityId: Activity["id"]) => void;
  handleDelete: (activityId: Activity["id"]) => void;
}

export const ActivityContext = createContext<ActivityContextProps>(null!);

export const ActivityProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(activityReducer, initialState);

  const { activities } = state;

  // Contadores
  const caloriesConsumed = useMemo(
    () =>
      activities.reduce(
        (total, activity) =>
          activity.category === 1 ? total + activity.calories : total,
        0
      ),
    [activities]
  );

  const caloriesBurned = useMemo(
    () =>
      activities.reduce(
        (total, activity) =>
          activity.category === 2 ? total + activity.calories : total,
        0
      ),
    [activities]
  );

  const netCalories = useMemo(
    () => caloriesConsumed - caloriesBurned,
    [activities]
  );

  const categoryName = useMemo(
    () => (category: Activity["category"]) =>
      categories.map((cat) => (cat.id === category ? cat.name : "")),
    [activities]
  );

  const isEmptyActivities = useMemo(() => !activities.length, [activities]);

  const handleEdit = (activityId: Activity["id"]) => {
    dispatch({ type: "set-activeId", payload: { id: activityId } });
  };

  const handleDelete = (activityId: Activity["id"]) => {
    dispatch({ type: "delete-activity", payload: { id: activityId } });
  };

  return (
    <ActivityContext.Provider
      value={{
        state,
        dispatch,
        caloriesConsumed,
        caloriesBurned,
        netCalories,
        categoryName,
        isEmptyActivities,
        handleEdit,
        handleDelete,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
