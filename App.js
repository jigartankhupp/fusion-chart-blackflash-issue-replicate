import React from 'react';
import {
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	Text,
	StatusBar,
} from 'react-native';

import {
	Header,
	LearnMoreLinks,
	Colors,
	DebugInstructions,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { FusionChartGraph } from './components/FusionChartGraph'
import axios from 'axios';


class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			timeFrame: '5Y',
			vestsItem: {},
			chartData: {},
			isLoadGraph: false
		}
	}

	setTimeFrame = (timeFrame) => {
		this.setState({ timeFrame: timeFrame });
	}

	componentDidMount(){
		this.getChartData()
	};

	getChartData() {
		const instance = axios.create({
			baseURL: 'https://api.jsonbin.io',
			timeout: 15000,
			headers: {'Content-Type': 'application/json', 'secret-key': '$2b$10$05RylxikQV3qbyCElMziDehs86GqSl8MweIJ.EgOgKnZSE9ZpDTNO'}
		});
		instance.get('/b/5de4941cb77d632ccda60812')
		.then((response) => {
			// handle success
			const graphsData = response.data.graphs;
			// console.log("graphsData", graphsData)
			this.setState({chartData: graphsData, isLoadGraph: true})
		})
		.catch((error) => {
			// handle error
			console.log(error);
		});
	}

	render() {
		return (
			<View>
				<StatusBar barStyle="dark-content" />
				<SafeAreaView>
					<ScrollView
						contentInsetAdjustmentBehavior="automatic"
						style={styles.scrollView}>
						{ (this.state.isLoadGraph == true) && <FusionChartGraph 
							setTimeFrame={this.setTimeFrame}
							timeFrame={this.state.timeFrame}
							graphsData={this.state.chartData[this.state.timeFrame].returns}
							inceptionDate={'2019-07-25'}
						/> }
			   		 </ScrollView>
		    	</SafeAreaView>
	    	</View>
	    );
	}
};

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: Colors.lighter,
	},
	engine: {
		position: 'absolute',
		right: 0,
	},
	body: {
		backgroundColor: Colors.white,
	},
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: Colors.black,
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
		color: Colors.dark,
	},
	highlight: {
		fontWeight: '700',
	},
	footer: {
		color: Colors.dark,
		fontSize: 12,
		fontWeight: '600',
		padding: 4,
		paddingRight: 12,
		textAlign: 'right',
	},
});

export default App;
