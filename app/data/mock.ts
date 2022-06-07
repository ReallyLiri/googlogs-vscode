//@ts-nocheck
import { GoogleProject } from "../common/googleProject";
import { google } from "@google-cloud/logging/build/protos/protos";
import ILogEntry = google.logging.v2.ILogEntry;

export const MOCK_PROJECTS: GoogleProject[] = [
  {id: "stg", name: "staging"},
  {id: "prod", name: "production"}
];

export const MOCK_WEB_URL = "https://console.cloud.google.com/logs/query;query=resource.type%3D%22k8s_container%22%20AND%20resource.labels.namespace_name%3D%22default%22%20AND%20resource.labels.container_name%3D%22ondemandscan%22%20AND%20%22responseOrInvalidateToken%22%20AND%20NOT%20%22errMsg%3Dtimeout%22%20AND%20NOT%20%22com.dropbox.core.InvalidAccessTokenException%22%20AND%20%28severity%3D%22ERROR%22%29%20AND%20timestamp%3E%3D%222022-06-06T23%3A30%3A20Z%22;?project=akooda-de4bc";

export const MOCK_LOGS: ILogEntry[] = Array(20).fill().map(i => (
    {
      "insertId": "hej2q46u808lwlua",
      "jsonPayload": {
        "e": "java.lang.NullPointerException: Cannot invoke \"String.toLowerCase(java.util.Locale)\" because the return value of \"java.net.URI.getHost()\" is null\n\tat com.acme.reactor.utils.PermalinkUtils.sanitizeUrl(PermalinkUtils.java:17)\n\tat com.acme.reactor.nlp.LinksExtractor.handleUrl(LinksExtractor.java:52)\n\tat com.acme.reactor.nlp.LinksExtractor.lambda$extractConversationLinks$0(LinksExtractor.java:30)\n\tat java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:183)\n\tat java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)\n\tat java.base/java.util.TreeMap$ValueSpliterator.forEachRemaining(TreeMap.java:3213)\n\tat java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:484)\n\tat java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:474)\n\tat java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:150)\n\tat java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:173)\n\tat java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)\n\tat java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)\n\tat com.acme.reactor.nlp.LinksExtractor.extractConversationLinks(LinksExtractor.java:22)\n\tat com.acme.reactor.model.Conversation.updateConversationWithMessage(Conversation.java:106)\n\tat com.acme.reactor.model.ConversationsSnapshot.handleMessage(ConversationsSnapshot.java:113)\n\tat com.acme.reactor.service.ConversationHandler.lambda$handleMessage$2(ConversationHandler.java:105)\n\tat java.base/java.util.concurrent.ConcurrentHashMap.compute(ConcurrentHashMap.java:1940)\n\tat com.acme.reactor.service.ConversationHandler.handleMessage(ConversationHandler.java:101)\n\tat com.acme.reactor.service.MessageEventHandler.handle(MessageEventHandler.java:40)\n\tat com.acme.reactor.messaging.kafka.ReactorKafkaConsumer.lambda$onMessage$1(ReactorKafkaConsumer.java:61)\n\tat com.acme.datalib.messaging.kafka.KafkaConsumer.handleMessage(KafkaConsumer.java:44)\n\tat com.acme.reactor.messaging.kafka.ReactorKafkaConsumer.onMessage(ReactorKafkaConsumer.java:51)\n\tat jdk.internal.reflect.GeneratedMethodAccessor167.invoke(Unknown Source)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)\n\tat org.springframework.messaging.handler.invocation.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:169)\n\tat org.springframework.messaging.handler.invocation.InvocableHandlerMethod.invoke(InvocableHandlerMethod.java:119)\n\tat org.springframework.kafka.listener.adapter.HandlerAdapter.invoke(HandlerAdapter.java:56)\n\tat org.springframework.kafka.listener.adapter.MessagingMessageListenerAdapter.invokeHandler(MessagingMessageListenerAdapter.java:347)\n\tat org.springframework.kafka.listener.adapter.BatchMessagingMessageListenerAdapter.invoke(BatchMessagingMessageListenerAdapter.java:180)\n\tat org.springframework.kafka.listener.adapter.BatchMessagingMessageListenerAdapter.onMessage(BatchMessagingMessageListenerAdapter.java:172)\n\tat org.springframework.kafka.listener.adapter.BatchMessagingMessageListenerAdapter.onMessage(BatchMessagingMessageListenerAdapter.java:61)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.doInvokeBatchOnMessage(KafkaMessageListenerContainer.java:2268)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.invokeBatchOnMessageWithRecordsOrList(KafkaMessageListenerContainer.java:2258)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.invokeBatchOnMessage(KafkaMessageListenerContainer.java:2204)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.doInvokeBatchListener(KafkaMessageListenerContainer.java:2114)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.invokeBatchListener(KafkaMessageListenerContainer.java:1997)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.invokeListener(KafkaMessageListenerContainer.java:1976)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.invokeIfHaveRecords(KafkaMessageListenerContainer.java:1364)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.pollAndInvoke(KafkaMessageListenerContainer.java:1355)\n\tat org.springframework.kafka.listener.KafkaMessageListenerContainer$ListenerConsumer.run(KafkaMessageListenerContainer.java:1247)\n\tat java.base/java.util.concurrent.Executors$RunnableAdapter.call(Executors.java:515)\n\tat java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)\n\tat java.base/java.lang.Thread.run(Thread.java:831)\n",
        "mdc": {
          "id": "CPZPT2S2W_1654441215.694329",
          "context": "tenantId=8554852, appId=101"
        },
        "message": "Failed to handle task.",
        "caller": "com.acme.datalib.messaging.kafka.KafkaConsumer",
        "date": "Mon Jun 06 08:21:26 UTC 2022",
        "thread": "org.springframework.kafka.KafkaListenerEndpointContainer#0-0-C-1"
      },
      "resource": {
        "type": "k8s_container",
        "labels": {
          "location": "us-central1",
          "cluster_name": "acme-staging",
          "project_id": "acme-stage",
          "pod_name": "reactor-7cd8547b58-mfrbk",
          "namespace_name": "default",
          "container_name": "reactor"
        }
      },
      "timestamp": "2022-06-06T08:21:26.343874838Z",
      "severity": "DEBUG",
      "labels": {
        "k8s-pod/app_kubernetes_io/instance": "reactor",
        "k8s-pod/app_kubernetes_io/name": "reactor",
        "compute.googleapis.com/resource_name": "gke-acme-staging-acme-pool-1c92a002-qq6y",
        "k8s-pod/pod-template-hash": "7cd8547b58"
      },
      "logName": "projects/acme-stage/logs/stdout",
      "receiveTimestamp": "2022-06-06T08:21:27.763967650Z"
    }
  )
);
