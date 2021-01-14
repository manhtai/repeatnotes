export default function Card() {

  const clickMe = async () => {
    const wasm = await import('@repeatnotes/sm2')
    wasm.hello('You')
  }

  return (
    <div onClick={clickMe}>
      Click me!
    </div>
  )
}
