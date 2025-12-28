export default function TransferFooter({
    isTransfer,
    credits,
    totalAssign,
    setTotalAssign,
    loading,
    agentsDestinoLength,
    onTransfer
}) {
    return (
        <div className="CardAssignCampain__footer">
            {isTransfer ? (
                <div>
                    <label>
                        Total (<strong>{credits.total || 0}</strong>)
                        <input
                            type="number"
                            min="0"
                            max={credits.total || 0}
                            value={totalAssign}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0 && value <= (credits.total || 0)) {
                                    setTotalAssign(value);
                                }
                            }}
                        />
                    </label>
                    <button
                        onClick={onTransfer}
                        disabled={loading || agentsDestinoLength === 0}
                    >
                        {loading ? 'Transfiriendo...' : 'Transferir carga'}
                    </button>
                </div>
            ) : (
                <label>
                    Total (<strong>{credits.total || 0}</strong>)
                </label>
            )}
        </div>
    );
}
