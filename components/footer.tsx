export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-gray-500">
        <p>
          비개발자를 위한 Claude 가이드 —{' '}
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline"
          >
            Claude 시작하기 →
          </a>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          이 사이트의 콘텐츠는 지속적으로 업데이트됩니다.
        </p>
      </div>
    </footer>
  )
}
