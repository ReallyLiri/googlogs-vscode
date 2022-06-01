//@ts-nocheck
import { GoogleProject } from "../common/googleProject";
import { google } from "@google-cloud/logging/build/protos/protos";
import ILogEntry = google.logging.v2.ILogEntry;

export const MOCK_PROJECTS: GoogleProject[] = [
  {id: "stg", name: "staging"},
  {id: "prod", name: "production"}
];

export const MOCK_LOGS: ILogEntry[] = Array(20).fill().map(i => (
    {
      "insertId": "eom1vlrqncmecgai",
      "jsonPayload": {
        "thread": "http-nio-3000-exec-1",
        "mdc": {
          "taskContext": "tenantId=123456789, appId=101",
          "event": "class com.slack.api.model.event.MessageChangedEvent"
        },
        "e": "",
        "date": "Sun May 29 07:06:36 UTC 2022",
        "message": "Handling incoming event",
        "caller": "com.acme.api.service.slack.event.SlackEventService"
      },
      "resource": {
        "type": "k8s_container",
        "labels": {
          "container_name": "api",
          "namespace_name": "default",
          "pod_name": "api-77fc976468-tpnm4",
          "location": "us-central1",
          "project_id": "acme-stage",
          "cluster_name": "acme-staging"
        }
      },
      "timestamp": "2022-05-29T07:06:36.325655620Z",
      "severity": "INFO",
      "labels": {
        "k8s-pod/app_kubernetes_io/instance": "api",
        "k8s-pod/pod-template-hash": "77fc976468",
        "k8s-pod/app_kubernetes_io/name": "api",
        "compute.googleapis.com/resource_name": "gke-acme-staging-acme-pool-1c92a002-xud9"
      },
      "logName": "projects/acme-stage/logs/stdout",
      "receiveTimestamp": "2022-05-29T07:06:36.484707189Z"
    }
  )
);
