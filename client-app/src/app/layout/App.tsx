import React, { useState, useEffect, Fragment, SyntheticEvent, useContext } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from "../../stores/activityStore";
import { observer } from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore)
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setsubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleEditActivity = (activity: IActivity) => {
    setsubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([
        ...activities.filter((a) => a.id !== activity.id),
        activity,
      ]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setsubmitting(false));
  };

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setsubmitting(true);
    setTarget(event.currentTarget.name)
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter((a) => a.id !== id)]);
    }).then(() => setsubmitting(false));;
  };

  useEffect(() => {
   activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content="Loading activities..." />;

  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activityStore.activities}
          selectActivity={activityStore.selectActivity}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default observer(App);
