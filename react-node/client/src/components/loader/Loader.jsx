class Loader {
	constructor(props){
		super(props)
		this.state = {
			isLoading: false
		}
	}
	render(){
		return {this.state.isLoading?
			<div className="loader-cont">
				<div id="loader"></div>
			</div>:''
		};
	}
	componentDidMount(){
		globalState.addListener('changed', (data)=>{
			this.setState({
				isLoading: data.isLoading;
			})	
		})
	}
}