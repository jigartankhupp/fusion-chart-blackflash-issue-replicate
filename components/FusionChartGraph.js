import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import moment from 'moment'
import { round } from 'lodash';
import FusionCharts from 'react-native-fusioncharts';


let libraryPath = Platform.select({
	// Specify fusioncharts.html file location
	ios: require('../assets/fusioncharts.html'),
	android: { uri: 'file:///android_asset/fusioncharts.html' }
});

export class FusionChartGraph extends Component {

	static propTypes = {
		setTimeFrame: PropTypes.func,
		timeFrame: PropTypes.string,
		graphsData: PropTypes.array,
		inceptionDate: PropTypes.string,
	}

	constructor(props) {
		super(props);

		this.state = {
			events: {
				rendercomplete: (e, a) => {
					console.log('renderComplete');
				}
			}
		}
	}

	setFormateLabel = (value) => {
		switch(this.props.timeFrame){
			case '1W':
				return moment(value).format("Do MMM")
			break;
			case '1M':
				return moment(value).format("Do MMM")
			break;
			case '3M':
				return moment(value).format("Do MMM")
			break;
			case '1Y':
				return moment(value).format("MMM 'YY")
			break;
			case '5Y':
				return moment(value).format("MMM 'YY")
			break;
			case 'MAX':
				return moment(value).format("MMM 'YY")
			break;
			default:
				return moment(value).format("MMM 'YY")
			break;
		}
	}

	loadGraphData(graphData){
		const category = [];
		const datasetVest = [];
		const datasetSp500 = [];
		for ( i in graphData) {
			let categoryObj;
			if(moment(graphData[i].date,"YYYY-MM-DD").isSame(this.props.inceptionDate)){
				categoryObj = {
					"vline": "true",
					lineposition: "0",
					color: "#000",
					labelhalign: "center",
					labelposition: "0",
					label: "Custom Line",
					showLabelBorder: 0,
					labelBgColor: "#00000000",
					labelFontColor: "#000",
					labelHAlign: "center",
					labelVAlign: "top",
				}
			}else{
				categoryObj = {
					"label": this.setFormateLabel(graphData[i].date)
				}
			}
			category.push(categoryObj);

			const datasetVestObj = {
				"value": graphData[i].vest
			}
			datasetVest.push(datasetVestObj);

			const datasetSp500Obj = {
				"value": graphData[i].sp500
			}
			datasetSp500.push(datasetSp500Obj);
		}
		const ds = {
			"chart": {
				rotatelabels: "0",
				setadaptiveymin: "1",
				drawAnchors: "0",
				divLineDashed: 1,
				divLineDashLen: 0,
				divLineDashGap: 0,
				paletteColors: "#54a7dc,#e16040",
				labelStep: round(category.length/4),
				labelDisplay: "Auto",
				numberSuffix: "%",
				showLegend: 0,
				showXAxisLine: 1,
				showYAxisValues: 1,
				showYAxisLine: true,
				xAxisLineColor: '#E8ECEF',
				yAxisLineColor: '#E8ECEF',
				theme: "fusion",
				showToolTip: false,
				showBorder: 0,
				divLineColor: "#ffffff",
				yAxisMinValue: 0,
				baseFontSize: 14,
				// animation: 0,
				chartLeftMargin: 10,
				xaxislinethickness: 2,
			},
			"categories": [
				{
					"category": category
				}
			],
			"dataset": [
				{
					"seriesname": "Vest",
					"anchorbgcolor": '#54a7dc',
					"data": datasetVest
				},
				{
					"seriesname": "S&P500",
					"anchorbgcolor": "#e16040",
					"data": datasetSp500
				}
			]
		};
		return ds;
	}

	render(){
		const { timeFrame, setTimeFrame, graphsData, inceptionDate } = this.props;
		return(
			<View>
				<View style={styles.segmentContainer}>
					<TouchableOpacity onPress={() => setTimeFrame('MAX') } style={styles.tabHead} >
						{ timeFrame == 'MAX' && <View style={styles.activeBorderLine} /> }
						<View style={{flexDirection: 'row'}}>
							<Text style={[ styles.tabText, { color: timeFrame == 'MAX' ? '#54a7dc' : '#778ca2' } ]}>MAX</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setTimeFrame('5Y') } style={styles.tabHead} >
						{ timeFrame == '5Y' && <View style={styles.activeBorderLine} /> }
						<View style={{flexDirection: 'row'}}>
							<Text style={[ styles.tabText, { color: timeFrame == '5Y' ? '#54a7dc' : '#778ca2' } ]}>5Y</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setTimeFrame('1Y') }  style={styles.tabHead} >
						{ timeFrame == '1Y' && <View style={styles.activeBorderLine} /> }
						<View>
							<Text style={[ styles.tabText, { color: timeFrame == '1Y' ? '#54a7dc' : '#778ca2' } ]}>1Y</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setTimeFrame('3M') } style={styles.tabHead} >
						{ timeFrame == '3M' && <View style={styles.activeBorderLine} /> }
						<View>
							<Text style={[ styles.tabText, { color: timeFrame == '3M' ? '#54a7dc' : '#778ca2' } ]}>3M</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setTimeFrame('1M') } style={styles.tabHead} >
						{ timeFrame == '1M' && <View style={styles.activeBorderLine} /> }
						<View style={{flexDirection: 'row'}}>
							<Text style={[ styles.tabText, { color: timeFrame == '1M' ? '#54a7dc' : '#778ca2' } ]}>1M</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => setTimeFrame('1W') }  style={styles.tabHead} >
						{ timeFrame == '1W' && <View style={styles.activeBorderLine} /> }
						<View>
							<Text style={[ styles.tabText, { color: timeFrame == '1W' ? '#54a7dc' : '#778ca2' } ]}>1W</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={[styles.chartContainer]}>
					<FusionCharts
						type="msspline"
						width="100%"
						height="100%"
						dataFormat="json"
						dataSource={this.loadGraphData(graphsData)}
						libraryPath={libraryPath}
						events={this.state.events}
					/>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	segmentContainer: {
		flex: 1,
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'stretch',
		backgroundColor: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#f2f4f6'
	},
	tabHead: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		position: 'relative'
	},
	activeBorderLine: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		width: '100%',
		borderBottomWidth: 2,
		borderBottomColor: '#54a7dc'
	},
	noFundingText: {
		color: '#98a9bc',
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
		width: '75%',
		marginLeft: 'auto',
		marginRight: 'auto',
		marginBottom: 20,
		marginTop: 10
	},
	chartContainer: {
		height: 200,
		paddingTop: 15
	},
});