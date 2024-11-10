

   	// livechat by www.mylivechat.com/  2018-06-12

   	


	   MyLiveChat.Version =3017;
	   MyLiveChat.FirstRequestTimeout =21600;
	   MyLiveChat.NextRequestTimeout =43200;
	   MyLiveChat.SyncType ="VISIT";
	   MyLiveChat.SyncStatus ="READY";
	   MyLiveChat.SyncUserName ="Guest_5bae57eb";
	   MyLiveChat.SyncResult =null;
	   MyLiveChat.HasReadyAgents =false;
	   MyLiveChat.SourceUrl ="https://zenitglobaldxpress.services/profile/track-result.php#";
	   MyLiveChat.AgentTimeZone = parseInt("1" || "-5");
	   MyLiveChat.VisitorStatus ="VISIT";
	   MyLiveChat.UrlBase ="https://s4.mylivechat.com/livechat2/";
	   MyLiveChat.SiteUrl ="https://s4.mylivechat.com/";

   	

	   if (!MyLiveChat.AgentId) MyLiveChat.AgentId = MyLiveChat.RawAgentId;

	   MyLiveChat.Departments = [];

	   MyLiveChat.Departments.push({
		   Name:"Default",
		   Agents: [{
			   Id:'User:1',
			   Name:"admin",
			   Online:false
   			}],
		   Online:false
   		});



	   MyLiveChat.VisitorUrls = [];



   	


	   MyLiveChat.VisitorLocation ="FR|France|B2|Lorraine|";
	   MyLiveChat.LastLoadTime = new Date().getTime();
	   MyLiveChat.VisitorDuration =0;
	   MyLiveChat.VisitorEntryUrl ="https://zenitglobaldxpress.services/profile/track-result.php#";
	   MyLiveChat.VisitorReferUrl =null;

	   MyLiveChat.VisitorUrls = [];



   	
	   MyLiveChat.VisitorUrls.push("https://zenitglobaldxpress.services/profile/track-result.php#");
   	

	   MyLiveChat_Initialize();

	   if (MyLiveChat.localStorage || MyLiveChat.userDataBehavior) {
		   MyLiveChat_SyncToCPR();
	   }

   	