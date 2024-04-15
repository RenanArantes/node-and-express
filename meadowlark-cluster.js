const cluster = require("cluster");

function startWorker() {
  const worker = cluster.fork();
  console.log("CLUSTER: Worker %d started", worker.id);
}

if (cluster.isMaster) {
  require("os").cpus().forEach(startWorker);

  // registra workers que se desconectaram; se um worker se desconectar,
  // ele deve ser encerrado, logo, esperaremos o evento de encerramento
  // para criar um novo worker e substituir o que foi encerrado
  cluster.on("disconnect", function (worker) {
    console.log("CLUSTER: Worker %d disconnected from the cluster.", worker.id);
  });

  // quando um worker morre (encerra), cria um novo worker para substituí-lo
  cluster.on("exit", function (worker, code, signal) {
    console.log("CLUSTER: Worker %d died with exit code %d (%s)", worker.id, code, signal);
    startWorker();
  });
} else {
  const port = process.env.PORT || 3000;
  // inicia o servidor na porta 3000
  require("./meadowlark.js")(port);
}
