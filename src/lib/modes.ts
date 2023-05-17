export type AllModes = NormalMode | SelectWaypointMode;

type NormalMode = {
    mode: 'normal',
};

type SelectWaypointMode = {
    mode: 'selectWaypoint',
    callback: (waypoint: string) => void,
};
