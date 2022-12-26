import CoreModuleConsumer from "components/Consumers/CoreModuleConsumer";

export default function App() {
    return (
        <div className="App">
            <CoreModuleConsumer
                onLoaded={(core) => <h1>{core.Greeting("Aardhyn", "Lavender") ?? "hello?"}</h1>}
                onError={(error) => <p>{`${error}`}</p>}
                onLoading={<p>loading core module...</p>}
            />
        </div>
    )
}