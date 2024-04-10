import { useSyncExternalStore } from 'react'
import * as ReactDOM from 'react-dom/client'

const mediaQuery = '(max-width: 600px)'

// 🐨 put getSnapshot and subscribe in a new function called makeMediaQueryStore
// which accepts a mediaQuery and returns a hook that uses useSyncExternalStore
// with the subscribe and getSnapshot functions.

function makeMediaQueryStore(mediaQuery: string) {
	function getSnapshot() {
		return window.matchMedia(mediaQuery).matches
	}
	
	function subscribe(callback: () => void) {
		const mediaQueryList = window.matchMedia(mediaQuery)
		mediaQueryList.addEventListener('change', callback)
		return () => {
			mediaQueryList.removeEventListener('change', callback)
		}
	}

	return () => useSyncExternalStore(subscribe, getSnapshot)
}
// 🐨 put everything above in the makeMediaQueryStore function

// 🐨 call makeMediaQueryStore with '(max-width: 600px)' and assign the return
// value to a variable called useNarrowMediaQuery
const useNarrowMediaQuery = makeMediaQueryStore(mediaQuery)

function NarrowScreenNotifier() {
	// 🐨 call useNarrowMediaQuery here instead of useSyncExternalStore
	const isNarrow = useNarrowMediaQuery()
	return isNarrow ? 'You are on a narrow screen' : 'You are on a wide screen'
}

function App() {
	return <NarrowScreenNotifier />
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
