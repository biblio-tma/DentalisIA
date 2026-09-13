export default function Button({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full mt-8 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
    >
      Continuer
      <span aria-hidden="true">→</span>
    </button>
  );
}