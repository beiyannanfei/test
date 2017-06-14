var response = {
	"took": 6,
	"timed_out": false,
	"_shards": {"total": 22, "successful": 22, "failed": 0},
	"hits": {
		"total": 28333,
		"max_score": 1,
		"hits": [
			{
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "indices_stats",
				"_id": "AVykhDS5Xc1i0y_01QMx",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.676Z",
					"source_node": {
						"uuid": "65YV5g0QTAi_7yIRVdpZ1Q",
						"host": "127.0.0.1",
						"transport_address": "127.0.0.1:9300",
						"ip": "127.0.0.1",
						"name": "Hyde",
						"attributes": {}
					},
					"indices_stats": {
						"_all": {
							"primaries": {
								"docs": {"count": 223},
								"store": {"size_in_bytes": 400291},
								"indexing": {
									"index_total": 390,
									"index_time_in_millis": 152,
									"is_throttled": false,
									"throttle_time_in_millis": 0
								},
								"search": {"query_total": 217, "query_time_in_millis": 680}
							},
							"total": {
								"docs": {"count": 223},
								"store": {"size_in_bytes": 400291},
								"indexing": {
									"index_total": 390,
									"index_time_in_millis": 152,
									"is_throttled": false,
									"throttle_time_in_millis": 0
								},
								"search": {"query_total": 217, "query_time_in_millis": 680}
							}
						}
					}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "cluster_state",
				"_id": "AVykhDS5Xc1i0y_01QMy",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.676Z",
					"source_node": {
						"uuid": "65YV5g0QTAi_7yIRVdpZ1Q",
						"host": "127.0.0.1",
						"transport_address": "127.0.0.1:9300",
						"ip": "127.0.0.1",
						"name": "Hyde",
						"attributes": {}
					},
					"cluster_state": {
						"status": "yellow",
						"version": 52,
						"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
						"master_node": "65YV5g0QTAi_7yIRVdpZ1Q",
						"nodes": {
							"65YV5g0QTAi_7yIRVdpZ1Q": {
								"name": "Hyde",
								"transport_address": "127.0.0.1:9300",
								"attributes": {}
							}
						}
					}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "node",
				"_id": "AVykhDS5Xc1i0y_01QMz",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.676Z",
					"source_node": {
						"uuid": "65YV5g0QTAi_7yIRVdpZ1Q",
						"host": "127.0.0.1",
						"transport_address": "127.0.0.1:9300",
						"ip": "127.0.0.1",
						"name": "Hyde",
						"attributes": {}
					},
					"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
					"node": {"id": "65YV5g0QTAi_7yIRVdpZ1Q"}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "shards",
				"_id": "Ne3-fv0TTi2AAdA7l3ELRQ:65YV5g0QTAi_7yIRVdpZ1Q:myindex2:3:p",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.677Z",
					"source_node": {
						"uuid": "65YV5g0QTAi_7yIRVdpZ1Q",
						"host": "127.0.0.1",
						"transport_address": "127.0.0.1:9300",
						"ip": "127.0.0.1",
						"name": "Hyde",
						"attributes": {}
					},
					"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
					"shard": {
						"state": "STARTED",
						"primary": true,
						"node": "65YV5g0QTAi_7yIRVdpZ1Q",
						"relocating_node": null,
						"shard": 3,
						"index": "myindex2"
					}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "shards",
				"_id": "Ne3-fv0TTi2AAdA7l3ELRQ:_na:myindex2:3:r",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.677Z",
					"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
					"shard": {
						"state": "UNASSIGNED",
						"primary": false,
						"node": null,
						"relocating_node": null,
						"shard": 3,
						"index": "myindex2"
					}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "shards",
				"_id": "Ne3-fv0TTi2AAdA7l3ELRQ:65YV5g0QTAi_7yIRVdpZ1Q:myindex2:2:p",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.677Z",
					"source_node": {
						"uuid": "65YV5g0QTAi_7yIRVdpZ1Q",
						"host": "127.0.0.1",
						"transport_address": "127.0.0.1:9300",
						"ip": "127.0.0.1",
						"name": "Hyde",
						"attributes": {}
					},
					"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
					"shard": {
						"state": "STARTED",
						"primary": true,
						"node": "65YV5g0QTAi_7yIRVdpZ1Q",
						"relocating_node": null,
						"shard": 2,
						"index": "myindex2"
					}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "shards",
				"_id": "Ne3-fv0TTi2AAdA7l3ELRQ:_na:myindex2:2:r",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.677Z",
					"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
					"shard": {
						"state": "UNASSIGNED",
						"primary": false,
						"node": null,
						"relocating_node": null,
						"shard": 2,
						"index": "myindex2"
					}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "shards",
				"_id": "Ne3-fv0TTi2AAdA7l3ELRQ:65YV5g0QTAi_7yIRVdpZ1Q:myindex2:1:p",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.677Z",
					"source_node": {
						"uuid": "65YV5g0QTAi_7yIRVdpZ1Q",
						"host": "127.0.0.1",
						"transport_address": "127.0.0.1:9300",
						"ip": "127.0.0.1",
						"name": "Hyde",
						"attributes": {}
					},
					"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
					"shard": {
						"state": "STARTED",
						"primary": true,
						"node": "65YV5g0QTAi_7yIRVdpZ1Q",
						"relocating_node": null,
						"shard": 1,
						"index": "myindex2"
					}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "shards",
				"_id": "Ne3-fv0TTi2AAdA7l3ELRQ:_na:myindex2:1:r",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.677Z",
					"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
					"shard": {
						"state": "UNASSIGNED",
						"primary": false,
						"node": null,
						"relocating_node": null,
						"shard": 1,
						"index": "myindex2"
					}
				}
			}, {
				"_index": ".marvel-es-1-2017.06.14",
				"_type": "shards",
				"_id": "Ne3-fv0TTi2AAdA7l3ELRQ:65YV5g0QTAi_7yIRVdpZ1Q:myindex2:4:p",
				"_score": 1,
				"_source": {
					"cluster_uuid": "9O_bDuqoSwaoAUUJx5S-LQ",
					"timestamp": "2017-06-14T02:52:26.677Z",
					"source_node": {
						"uuid": "65YV5g0QTAi_7yIRVdpZ1Q",
						"host": "127.0.0.1",
						"transport_address": "127.0.0.1:9300",
						"ip": "127.0.0.1",
						"name": "Hyde",
						"attributes": {}
					},
					"state_uuid": "Ne3-fv0TTi2AAdA7l3ELRQ",
					"shard": {
						"state": "STARTED",
						"primary": true,
						"node": "65YV5g0QTAi_7yIRVdpZ1Q",
						"relocating_node": null,
						"shard": 4,
						"index": "myindex2"
					}
				}
			}]
	}
}