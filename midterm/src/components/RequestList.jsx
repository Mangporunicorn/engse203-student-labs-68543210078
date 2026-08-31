import RequestCard from './RequestCard.jsx';

function RequestList({
  requests,
  onDeleteRequest,
  onMarkDone,
  emptyMessage,
}) {
  if (requests.length === 0) {
    return (
      <p className="subtle-empty">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="request-list" data-testid="request-list">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          onDeleteRequest={onDeleteRequest}
          onMarkDone={onMarkDone}
        />
      ))}
    </div>
  );
}

export default RequestList;