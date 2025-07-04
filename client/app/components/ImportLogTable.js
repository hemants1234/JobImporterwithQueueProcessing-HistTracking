"use client";

export default function ImportLogTable({ logs }) {
  return (
    <> 
      <h1> Total{logs.length}  </h1>
    <table border="1" cellPadding="10" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Feed URL</th>
          <th>Total</th>
          <th>New</th>
          <th>Updated</th>
          <th>Failed</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log._id}>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>{log.fileName}</td>
            <td>{log.totalFetched}</td>
            <td>{log.newJobs}</td>
            <td>{log.updatedJobs}</td>
            <td>{log.failedJobs?.length || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}
